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
    const result = {
      totalStaked:
        validator.staked !== null
          ? `${formatNearTokenAmount(validator.staked)} NEAR`
          : DEFAULT_NEAR_VALUE,
      totalPending:
        validator.pending !== null
          ? `${formatNearTokenAmount(validator.pending)} NEAR`
          : DEFAULT_NEAR_VALUE,
      totalAvailable:
        validator.available !== null
          ? `${formatTotalAvailable(validator.available)} NEAR`
          : DEFAULT_NEAR_VALUE,
      canWithdraw: validator.canWithdraw,
      canUnstake: validator.canUnstake,
    };

    return result;
  }, [validator]);
  return formattedStakingBalanceData;
}

export const MIN_DISPLAYED_AVAILABLE = "< 0.00001";
export function formatTotalAvailable(amount: string) {
  if (amount === "0") return amount;
  return totalAvailableIsLessThanMinDisplayed(amount)
    ? MIN_DISPLAYED_AVAILABLE
    : formatNearTokenAmount(amount);
}

export function totalAvailableIsLessThanMinDisplayed(amount: string) {
  try {
    const WITHDRAW_AMOUNT_THRESHOLD = new BN("10000000000000000000");
    const availableAmount = new BN(amount);
    return availableAmount.lt(WITHDRAW_AMOUNT_THRESHOLD);
  } catch {
    return false;
  }
}
