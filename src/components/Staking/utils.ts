import { formatNearTokenAmount } from "@/utils/formatter";

import {
  CurrentEpochValidatorInfo,
  EpochValidatorInfo,
  NextEpochValidatorInfo,
  ValidatorStakeView,
} from "near-api-js/lib/providers/provider";
import { checkIfRecentValidator } from "./context/latestValidatorsStorage";

export const format = (value: string | null | undefined) => {
  if (value === null || value === undefined) return "0";
  return formatNearTokenAmount(value);
};

export enum VALIDATOR_TYPE {
  CURRENT_VALIDATOR = "current_validator",
  NEXT_VALIDATOR = "next_validator",
  CURRENT_PROPOSAL = "current_proposal",
}
export interface Validator {
  fee: {
    numerator: number;
    denominator: number;
    percentage: number;
  } | null;
  staked: string;
  unstaked: string;
  available: string;
  pending: string;
  publicKey: string;
  active: boolean;
  stake: string;
  type: VALIDATOR_TYPE;
  isSlashed: boolean;
  contractNotDeployedOrDontSupportStaking: boolean;
  accountId: string;
  canUnstake: boolean;
  canWithdraw: boolean;
  isFarmingValidator: boolean;
  farms: Farm[];
}

export type FarmToken = {
  icon: string;
  name: string;
  symbol: string;
  id: string;
  decimals: number;
};
export type Farm = {
  id: number;
  name: string;
  token: FarmToken;
  reward: string;
  active: boolean;
};
export const formatValidatorsData = (
  currentValidator:
    | CurrentEpochValidatorInfo
    | NextEpochValidatorInfo
    | ValidatorStakeView,
  type: VALIDATOR_TYPE
): Validator => {
  return {
    fee: null,
    staked: "0",
    unstaked: "0",
    available: "0",
    pending: "0",
    active: type === VALIDATOR_TYPE.CURRENT_VALIDATOR,
    contractNotDeployedOrDontSupportStaking: false,
    publicKey: currentValidator.public_key,
    stake: currentValidator.stake,
    type,
    isSlashed: isCurrentValidator(currentValidator)
      ? currentValidator.is_slashed
      : false,
    accountId: currentValidator.account_id,
    canUnstake: false,
    canWithdraw: false,
    isFarmingValidator: false,
    farms: [],
  };
};
export const resetValidator = (validator: Validator): Validator => {
  return {
    fee: null,
    staked: "0",
    unstaked: "0",
    available: "0",
    pending: "0",
    active: validator.active,
    contractNotDeployedOrDontSupportStaking: false,
    publicKey: validator.publicKey,
    stake: validator.stake,
    type: validator.type,
    isSlashed: validator.isSlashed,
    accountId: validator.accountId,
    canUnstake: false,
    canWithdraw: false,
    isFarmingValidator: validator.isFarmingValidator,
    farms: [],
  };
};

function isCurrentValidator(
  obj: Record<string, any>
): obj is CurrentEpochValidatorInfo {
  return typeof obj["is_slashed"] === "string";
}

export function prepareValidatorsData(
  accountId: string,
  epochValidator: EpochValidatorInfo
): Validator[] {
  const recentValidators: Validator[] = [];
  const validators: Validator[] = [];

  const currentValidatorsMap: Record<string, boolean> = {};
  const nextValidatorsMap: Record<string, boolean> = {};

  epochValidator.current_validators.forEach((validator) => {
    const formattedValidator = formatValidatorsData(
      validator,
      VALIDATOR_TYPE.CURRENT_VALIDATOR
    );
    currentValidatorsMap[formattedValidator.accountId] = true;
    if (checkIfRecentValidator(accountId, formattedValidator.accountId)) {
      recentValidators.push(formattedValidator);
    } else {
      validators.push(formattedValidator);
    }
  });
  epochValidator.next_validators.forEach((validator) => {
    if (currentValidatorsMap[validator.account_id]) return;
    const formattedValidator = formatValidatorsData(
      validator,
      VALIDATOR_TYPE.NEXT_VALIDATOR
    );
    nextValidatorsMap[formattedValidator.accountId] = true;
    if (checkIfRecentValidator(accountId, formattedValidator.accountId)) {
      recentValidators.push(formattedValidator);
    } else {
      validators.push(formattedValidator);
    }
  });
  epochValidator.current_proposals.forEach((validator) => {
    if (
      currentValidatorsMap[validator.account_id] ||
      nextValidatorsMap[validator.account_id]
    )
      return;
    const formattedValidator = formatValidatorsData(
      validator,
      VALIDATOR_TYPE.CURRENT_PROPOSAL
    );
    if (checkIfRecentValidator(accountId, formattedValidator.accountId)) {
      recentValidators.push(formattedValidator);
    } else {
      validators.push(formattedValidator);
    }
  });

  return recentValidators.concat(validators);
}
