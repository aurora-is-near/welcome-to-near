import { utils } from "near-api-js";
const NEAR_FRACTIONAL_DIGITS = 5;

export const formatNearTokenAmount = (amount: string) => {
  return utils.format.formatNearAmount(amount, NEAR_FRACTIONAL_DIGITS);
};
