import { Validator } from "@/components/Staking/utils";
import { useMemo } from "react";
import { DEFAULT_NEAR_VALUE } from "..";
import { formatNearTokenAmount } from "@/utils/formatter";
import BN from "bn.js";

export default function useValidatorFormattedData(validator: Validator) {
  const formattedStakingBalanceData = useMemo(() => {
    if (!validator) {
      return {
        totalStaked: DEFAULT_NEAR_VALUE,
        totalPending: DEFAULT_NEAR_VALUE,
        totalAvailable: DEFAULT_NEAR_VALUE,
        canWithdraw: false,
        canUnstake: false,
      };
    }
    const availableData = adjustTotalAvailableData(
      validator.available,
      validator.canWithdraw
    );

    const result = {
      totalStaked:
        validator.staked !== null
          ? `${formatNearTokenAmount(validator.staked)} NEAR`
          : DEFAULT_NEAR_VALUE,
      totalPending:
        validator.pending !== null
          ? `${formatNearTokenAmount(validator.pending)} NEAR`
          : DEFAULT_NEAR_VALUE,
      totalAvailable: `${availableData.amount} NEAR`,
      canWithdraw: availableData.canWithdraw,
      canUnstake: validator.canUnstake,
    };

    return result;
  }, [validator]);
  return formattedStakingBalanceData;
}

export const MIN_DISPLAYED_AVAILABLE = "< 0.00001";

/**
 * @description protection against tiny amount of near being withdrawable
 */
export function adjustTotalAvailableData(
  amount: string | null,
  canWithdraw: boolean | null
): { amount: string; canWithdraw: boolean } {
  if (canWithdraw === false || amount === null || canWithdraw === null) {
    return {
      amount: "0",
      canWithdraw: false,
    };
  }
  if (totalAvailableIsLessThanMinDisplayed(amount)) {
    return {
      amount: "0",
      canWithdraw: false,
    };
  }
  return {
    amount: formatNearTokenAmount(amount),
    canWithdraw,
  };
}

export function totalAvailableIsLessThanMinDisplayed(amount: string) {
  try {
    const availableAmount = new BN(amount);
    return availableAmount.lt(new BN("10000000000000000000")); // 0.00001 NEAR
  } catch {
    return false;
  }
}
