import { ReactNode, createContext, useContext } from "react";
import { AccountBalance } from "near-api-js/lib/account";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import fetchNep141Balances from "@/utils/fetchNep141Balances";
import { formatUnits } from "viem";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { useFinance } from "@/contexts/FinanceContext";
import getCoingeckoSymbol from "@/utils/getCoingeckoSymbol";

export type TokenInfo = {
  symbol: string;
  balance: string;
  decimals: number;
  iconSrc: string;
  contract?: string;
  coingeckoId?: string;
  formattedBalance: string;
  usdPrice: number | undefined;
  usdValue: number | undefined;
};

type TokensContext = {
  tokens: TokenInfo[];
  totalUsdValue: number;
  isLoading: boolean;
  refetch: () => Promise<
    [
      QueryObserverResult<AccountBalance, Error>,
      QueryObserverResult<
        {
          symbol: string;
          decimals: number;
          balance: string;
          iconSrc: string;
        }[],
        Error
      >,
    ]
  >;
};

const TokensContext = createContext({} as TokensContext);

const formatBalance = (balance: number | string, decimals: number) => {
  if (balance === "0" || balance === 0) {
    return "0.00";
  }

  try {
    return formatUnits(BigInt(balance), decimals);
  } catch (e) {
    return balance.toString();
  }
};

export const useTokens = () => {
  const context = useContext(TokensContext);
  if (!context) {
    throw new Error("useTokens must be used within TokensProvider");
  }
  return context;
};

export function TokensProvider({ children }: { children: ReactNode }) {
  const { accountId } = useWalletSelector();
  const {
    accountState,
    isLoading: nearBalanceLoading,
    updateAccountState,
  } = useFinance();

  const nearBalance = accountState?.available;

  const {
    data: nep141Balances,
    isLoading: nep141BalancesLoading,
    refetch: refetchNep141Balances,
  } = useQuery({
    queryKey: ["nep141Balances"],
    queryFn: async () => await fetchNep141Balances(accountId as string),
    enabled: !!accountId,
    refetchInterval: 5_000,
  });

  const { data: tokenPrices } = useQuery({
    queryKey: ["tokenPrices"],
    queryFn: async () => {
      const response = await fetch("/api/coingecko/all");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    refetchInterval: 30_000,
  });

  const tokens = !accountId
    ? []
    : [
        {
          symbol: "NEAR",
          balance: nearBalance ?? "0",
          decimals: 24,
          iconSrc: "/img/tokens/near.png",
        },
        ...(nep141Balances ?? []),
      ]
        .map((token) => {
          const formattedBalance = formatBalance(token.balance, token.decimals);

          const coingeckoId = getCoingeckoSymbol(token.symbol);

          const price = tokenPrices?.[coingeckoId]?.usd ?? 0;
          const usdValue = price * +formattedBalance;

          return {
            ...token,
            formattedBalance,
            usdPrice: price,
            usdValue,
          };
        })
        .filter(({ balance }) => balance !== "0")
        .sort((a, b) => b.usdValue - a.usdValue);

  const totalUsdValue = tokens.reduce((sum, { usdValue }) => sum + usdValue, 0);

  const refetchBalances = async () =>
    Promise.all([updateAccountState(), refetchNep141Balances()]);

  return (
    <TokensContext.Provider
      value={{
        tokens,
        totalUsdValue,
        isLoading: nearBalanceLoading || nep141BalancesLoading,
        refetch: refetchBalances,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
}
