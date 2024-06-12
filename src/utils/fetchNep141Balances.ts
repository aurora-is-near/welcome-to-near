import { nep141Balance } from "./near";
import { DEFAULT_TOKEN_LIST_MAP } from "@/constants/near";

type TokenBalances = Record<string, string | null>;

const TOKENS = DEFAULT_TOKEN_LIST_MAP;

const fetchNep141Balances = async (accountId: string) => {
  const balancesData = {} as TokenBalances;
  await Promise.all(
    Object.keys(TOKENS).map(async (contract) =>
      (async () => {
        const balance = await nep141Balance(accountId, contract);
        balancesData[contract] = balance;
      })()
    )
  );

  const nep141Balances = Object.keys(balancesData).map((key) => {
    //@ts-ignore
    const decimals = TOKENS[key].decimals;
    const balance = balancesData[key] ?? "0";

    return {
      //@ts-ignore
      symbol: TOKENS[key].symbol,
      decimals: decimals,
      //@ts-ignore
      iconSrc: TOKENS[key].icon,
      balance,
      //@ts-ignore
      contract: TOKENS[key].id,
    };
  });

  return nep141Balances;
};

export default fetchNep141Balances;
