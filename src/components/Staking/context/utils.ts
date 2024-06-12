import { NEAR_CONNECTION_CONFIG } from "@/constants";
import { Account, connect } from "near-api-js";
import { Validator } from "../utils";
import BN from "bn.js";
import {
  accountTotalBalance,
  canWithdraw,
  getTokenMetaData,
  stakedAmount,
  unstaked,
} from "@/utils/near";
import { addRecentValidator } from "./latestValidatorsStorage";
import { addValidatorsPayload } from ".";

type Farm = {
  farm_id: number;
  name: string;
  token_id: string;
  amount: string;
  start_date: string;
  end_date: string;
  active: boolean;
};

export const processValidatorsBatch = async (
  accountId: string,
  validators: Validator[]
): Promise<addValidatorsPayload> => {
  const ZERO = new BN("0");
  let totalUnstaked = ZERO.clone();
  let totalStaked = ZERO.clone();
  let totalAvailable = ZERO.clone();
  let totalPending = ZERO.clone();
  const validatorsWithAnyUserFunds = [];
  const validatorsWithStake = [];
  const validatorsWithWithdrawAvailable = [];
  const validatorsWithUnclaimedFarmingReward = [];
  const result = [];
  for (let i = 0; i < validators.length; i++) {
    try {
      const validator = validators[i];
      const [balanceRequest, feeResult, farms] = await Promise.all([
        accountTotalBalance(validator.accountId, accountId),
        getValidatorFee(validator.accountId),
        getFarms(accountId, validator.accountId),
      ]);
      if (balanceRequest.contractNotDeployedOrDontSupportStaking) {
        validator.contractNotDeployedOrDontSupportStaking = true;
      }
      const total = balanceRequest.total;
      const totalBn = new BN(total);
      const hasAnyFundsInValidator = totalBn.gt(ZERO);
      validator.fee = feeResult;

      if (farms.length > 0) {
        validator.isFarmingValidator = true;

        await Promise.all(
          farms.map(async (farm) => {
            const reward = await getUnclaimedRewards(
              accountId,
              validator.accountId,
              farm.farm_id
            );
            if (reward === null) return;
            if (reward === "0") return;
            if (farm.active === false) return;

            const metadata = await getTokenMetaData(farm.token_id);
            if (
              metadata === null ||
              !metadata.icon ||
              !metadata.name ||
              !metadata.decimals ||
              !metadata.symbol
            )
              return;
            validator.farms.push({
              id: farm.farm_id,
              name: farm.name,
              token: {
                id: farm.token_id,
                icon: metadata.icon,
                decimals: metadata.decimals,
                name: metadata.name,
                symbol: metadata.symbol,
              },
              reward,
              active: farm.active,
            });
          })
        );
        if (validator.farms.length > 0)
          validatorsWithUnclaimedFarmingReward.push(validator.accountId);
      }

      if (validator.farms.length > 0 || hasAnyFundsInValidator) {
        validatorsWithAnyUserFunds.push(validator.accountId);
      }

      if (!hasAnyFundsInValidator) {
        result.push(validator);
        continue;
      }
      const [unstakedAmount, isAvailable, staked] = await Promise.all([
        unstaked(accountId, validator.accountId),
        canWithdraw(accountId, validator.accountId),
        stakedAmount(accountId, validator.accountId),
      ]);
      validator.staked = staked;
      const stakedBN = new BN(staked);
      const hasStake = stakedBN.gt(ZERO);
      if (hasStake) {
        validator.canUnstake = true;
        validatorsWithStake.push(validator.accountId);
      }

      validator.unstaked = unstakedAmount;
      const unstakedBN = new BN(validator.unstaked);
      if (unstakedBN.gt(ZERO)) {
        if (isAvailable) {
          validator.available = validator.unstaked;
          totalAvailable = totalAvailable.add(unstakedBN);
          validator.canWithdraw = true;
          validatorsWithWithdrawAvailable.push(validator.accountId);
        } else {
          validator.pending = validator.unstaked;
          totalPending = totalPending.add(unstakedBN);
        }
      }

      totalStaked = totalStaked.add(stakedBN);
      totalUnstaked = totalUnstaked.add(unstakedBN);
      result.push(validator);
    } catch (e: any) {
      if (e.message.indexOf("cannot find contract code") === -1) {
        console.warn("Error getting data for validator");
      }
    }
  }

  return {
    validators: result,
    validatorsWithStake,
    validatorsWithWithdrawAvailable,
    validatorsWithUnclaimedFarmingReward,
    validatorsWithAnyUserFunds,
    balances: {
      totalUnstaked,
      totalStaked,
      totalAvailable,
      totalPending,
    },
  };
};

export function persistRecentValidators(
  accountId: string,
  payload: addValidatorsPayload
): addValidatorsPayload {
  addRecentValidator(
    accountId,
    payload.validatorsWithStake
      .concat(payload.validatorsWithWithdrawAvailable)
      .concat(payload.validatorsWithUnclaimedFarmingReward)
  );
  return payload;
}

export function addValidatorIfNotPresent(
  validatorAccountId: string,
  array: string[]
) {
  let shouldAdd = true;
  array.forEach((accountId) => {
    if (accountId === validatorAccountId) shouldAdd = false;
  });
  return shouldAdd ? array.concat([validatorAccountId]) : array;
}

export function addOrRemoveValidatorOnCondition(
  validatorAccountId: string,
  add: boolean,
  array: string[]
) {
  if (add) {
    array.forEach((accountId) => {
      if (accountId === validatorAccountId) add = false;
    });
    return add ? array.concat([validatorAccountId]) : array;
  }
  return array.filter((validator) => validator !== validatorAccountId);
}

export function calcBalanceDiff(
  total: string,
  old: string,
  newValue: string
): { isZero: boolean; diff: string } {
  const totalBN = new BN(total);
  const oldBN = new BN(old);
  const newBN = new BN(newValue);
  const result = totalBN.add(newBN.sub(oldBN));
  const isGreaterThanZero = result.gt(new BN("0"));
  return {
    isZero: !isGreaterThanZero,
    diff: isGreaterThanZero ? result.toString() : "0",
  };
}

export async function getFarms(
  accountId: string,
  contractId: string
): Promise<Farm[]> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, accountId);
    const farms = await acc.viewFunction({
      contractId,
      methodName: "get_farms",
      args: { from_index: 0, limit: 300 },
    });
    console.log(
      `EXECUTING: get_farms ${contractId} for ${accountId}: ${farms}`
    );
    return farms;
  } catch (e) {
    console.info(
      `INFO: get_farms ${contractId} for ${accountId}. ${contractId} is not a farming validator`
    );
    return [];
  }
}
export async function getUnclaimedRewards(
  accountId: string,
  contractId: string,
  farmId: number
): Promise<string | null> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, accountId);
    const reward = await acc.viewFunction({
      contractId,
      methodName: "get_unclaimed_reward",
      args: { account_id: accountId, farm_id: farmId },
    });
    console.log(
      `EXECUTING: get_unclaimed_reward ${contractId} for ${accountId}: ${reward}`
    );
    return reward;
  } catch (e) {
    console.warn(
      `FAILED TO EXECUTE: get_unclaimed_reward ${contractId} for ${accountId}`
    );
    return null;
  }
}

type ValidatorFee = {
  numerator: number;
  denominator: number;
  percentage: number;
};

type validatorId = string;
const GET_VALIDATOR_FEE_CACHE: Record<validatorId, ValidatorFee> = {};
export async function getValidatorFee(
  accountId: string
): Promise<ValidatorFee | null> {
  try {
    const cachedValue = GET_VALIDATOR_FEE_CACHE[accountId];
    if (cachedValue) return cachedValue;
    const fee = await validatorRewardFeeFraction(accountId);
    let result;
    if (!fee) {
      result = null;
    } else {
      result = {
        numerator: fee.numerator,
        denominator: fee.denominator,
        percentage: +((fee.numerator / fee.denominator) * 100).toFixed(2),
      };
    }
    GET_VALIDATOR_FEE_CACHE[accountId] = cachedValue;
    return result;
  } catch (error) {
    console.error(`Failed to get fee  for a validator ${accountId}`);
    return null;
  }
}

async function validatorRewardFeeFraction(validatorId: string): Promise<{
  numerator: number;
  denominator: number;
} | null> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, "dontcare");
    const result = await acc.viewFunction({
      contractId: validatorId,
      methodName: "get_reward_fee_fraction",
      args: {},
    });
    return result;
  } catch (e) {
    console.error("Failed call get_reward_fee_fraction", e);
    return null;
  }
}
