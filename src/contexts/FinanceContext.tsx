import { ReactNode, createContext, useContext, useMemo } from "react";
import { useWalletSelector } from "./WalletSelectorContext";
import { nearBalance } from "@/utils/near";
import BN from "bn.js";
import { AccountBalance } from "near-api-js/lib/account";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { utils } from "near-api-js";
import { NEAR_MAX_AMOUNT_PADDING } from "@/constants/near";

export interface FinanceData extends AccountBalance {
  hasNear: boolean;
}

type FinanceContext = {
  accountState: FinanceData | null;
  isLoading: boolean;
  isError: boolean;
  updateAccountState: () => Promise<QueryObserverResult<AccountBalance, Error>>;
};

const FinanceContext = createContext({} as FinanceContext);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return context;
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { accountId } = useWalletSelector();

  const {
    data: accountState,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["nearBalance", accountId],
    queryFn: async () => await nearBalance(accountId as string),
    enabled: !!accountId,
    refetchInterval: 30_000,
  });

  const state = useMemo(() => {
    if (!accountState)
      return {
        accountState: null,
        isLoading,
        isError,
        updateAccountState: refetch,
      };

    const paddingAdjustedBalance = new BN(accountState.available).sub(
      new BN(utils.format.parseNearAmount(NEAR_MAX_AMOUNT_PADDING)!)
    );

    const adjustedBalanceGtZero = paddingAdjustedBalance.gt(new BN(0));

    return {
      accountState: Object.assign({}, accountState, {
        available: adjustedBalanceGtZero
          ? paddingAdjustedBalance.toString()
          : "0",
        hasNear: adjustedBalanceGtZero,
      }) as FinanceData,
      isLoading,
      isError,
      updateAccountState: refetch,
    };
  }, [accountState, isError, isLoading, refetch]);

  return (
    <FinanceContext.Provider value={state}>{children}</FinanceContext.Provider>
  );
}
