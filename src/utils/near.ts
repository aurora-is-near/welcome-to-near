import { NEAR_CONNECTION_CONFIG } from "@/constants";
import { FT_MINIMUM_STORAGE_BALANCE_LARGE } from "@/constants/near";
import { Account, connect } from "near-api-js";
import { AccountBalance } from "near-api-js/lib/account";
import {
  AccessKeyInfoView,
  AccessKeyList,
  EpochValidatorInfo,
} from "near-api-js/lib/providers/provider";

export function txExplorerLink(txHash: string) {
  return `${process.env.explorerUrl}/txns/${txHash}`;
}
export function accountExplorerLink(account: string) {
  return `${process.env.explorerUrl}/address/${account}`;
}

export async function nearAccount(accountId: string): Promise<any> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const response = await nearConnection.connection.provider.query({
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    });
    console.log("Fetching near account result:", response);
    return response;
  } catch (e) {
    console.error("Failed to fetch account or it doesn't exist ");
    return null;
  }
}
export async function storageBalance(
  accountId: string,
  contractId: string
): Promise<any> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, accountId);
    const storageBalance = await acc.viewFunction({
      contractId,
      methodName: "storage_balance_of",
      args: { account_id: accountId },
    });

    return storageBalance;
  } catch (e) {
    console.error(`Failed to execute storage_balance_of ${contractId}`);
    return null;
  }
}

export async function nearBalance(accountId: string): Promise<AccountBalance> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const account = await nearConnection.account(accountId);
    const balance = await account.getAccountBalance();
    console.log("Account NEAR balance data", balance);
    return balance;
  } catch (e) {
    console.error("Failed to get account balance");
    throw new Error("Failed to get NEAR account balance.");
  }
}
export async function nep141Balance(
  accountId: string,
  contractId: string
): Promise<string | null> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, accountId);
    const storageBalance = await acc.viewFunction({
      contractId,
      methodName: "ft_balance_of",
      args: { account_id: accountId },
    });
    return storageBalance;
  } catch (e) {
    console.warn(
      `Failed to check nep141 balance (ft_balance_of) of ${contractId}`,
      e
    );
    return null;
  }
}

export async function validators(): Promise<EpochValidatorInfo | null> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const response = await nearConnection.connection.provider.validators(null);
    console.log("Fetching near validators result:", response);
    return response;
  } catch (e) {
    console.error("Failed to fetch validators");
    return null;
  }
}

export async function stakedAmount(
  accountId: string,
  validatorId: string
): Promise<string> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, accountId);
    const stake = await acc.viewFunction({
      contractId: validatorId,
      methodName: "get_account_staked_balance",
      args: { account_id: accountId },
    });
    console.log(
      `Staked amount of ${accountId} in ${validatorId} is ${stake}`,
      stake
    );
    return stake;
  } catch (e) {
    console.error("Failed to get staked amount");
    return "0";
  }
}
export async function unstaked(
  accountId: string,
  validatorId: string
): Promise<string> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, accountId);
    const stake = await acc.viewFunction({
      contractId: validatorId,
      methodName: "get_account_unstaked_balance",
      args: { account_id: accountId },
    });
    console.log(
      `Unstake amount of ${accountId} in ${validatorId} is ${stake}`,
      stake
    );
    return stake;
  } catch (e) {
    console.error("Failed to get unstaked amount");
    return "0";
  }
}
export async function canWithdraw(
  accountId: string,
  validatorId: string
): Promise<boolean> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, accountId);
    return acc.viewFunction({
      contractId: validatorId,
      methodName: "is_account_unstaked_balance_available",
      args: { account_id: accountId },
    });
  } catch (e) {
    console.warn("Failed to check if can withdraw", e);
    return false;
  }
}

/**
 *
 * @description Returns the total balance of the given account (including staked and unstaked balances).
 */
export async function accountTotalBalance(
  validatorId: string,
  accountId: string
): Promise<{
  total: string;
  contractNotDeployedOrDontSupportStaking: boolean;
}> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, "dontcare");
    const result = await acc.viewFunction({
      contractId: validatorId,
      methodName: "get_account_total_balance",
      args: { account_id: accountId },
    });
    return { total: result, contractNotDeployedOrDontSupportStaking: false };
  } catch (e: any) {
    if (
      // Error means that the validators don't have contract deployed, or don't support staking
      e.message.includes("CompilationError(CodeDoesNotExist") ||
      e.message.includes("MethodResolveError(MethodNotFound)")
    ) {
      return { total: "0", contractNotDeployedOrDontSupportStaking: true };
    }
    return { total: "0", contractNotDeployedOrDontSupportStaking: false };
  }
}

type TokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  reference: string;
  reference_hash: string;
  decimals: number;
};

type tokenId = string;
const GET_TOKEN_METADATA_CACHE: Record<tokenId, TokenMetadata> = {};
export async function getTokenMetaData(
  tokenId: tokenId
): Promise<TokenMetadata | null> {
  try {
    const cachedValue = GET_TOKEN_METADATA_CACHE[tokenId];
    if (cachedValue) return cachedValue;
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, tokenId);
    const metadata = await acc.viewFunction({
      contractId: tokenId,
      methodName: "ft_metadata",
    });
    GET_TOKEN_METADATA_CACHE[tokenId] = metadata;
    return metadata;
  } catch (e) {
    console.error(`Failed to get ${tokenId} metadata`);
    return null;
  }
}

// Taken from near-sdk-js
const ACCOUNT_ID_REGEX =
  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;

/**
 * Validates the Account ID according to the NEAR protocol
 * [Account ID rules](https://nomicon.io/DataStructures/Account#account-id-rules).
 *
 * @param accountId - The Account ID string you want to validate.
 */
export function validateAccountId(accountId: string) {
  return (
    accountId.length >= 2 &&
    accountId.length <= 64 &&
    ACCOUNT_ID_REGEX.test(accountId)
  );
}

export async function fetchAccessKeys(
  accountId: string
): Promise<AccessKeyInfoView[]> {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const response =
      await nearConnection.connection.provider.query<AccessKeyList>({
        request_type: "view_access_key_list",
        finality: "final",
        account_id: accountId,
      });
    console.log(`Fetching account ${accountId} access keys:`, response);
    return response.keys;
  } catch (e) {
    console.error(`Failed to fetch account ${accountId} access keys.`, e);
    return [];
  }
}

export const getMinStorageBalance = async (
  nep141Address: string
): Promise<string> => {
  try {
    const nearConnection = await connect(NEAR_CONNECTION_CONFIG);
    const acc = new Account(nearConnection.connection, "dontcare");
    const data = await acc.viewFunction({
      contractId: nep141Address,
      methodName: "storage_balance_bounds",
      blockQuery: {
        finality: "optimistic",
      },
    });
    if (!data || !data.min) return FT_MINIMUM_STORAGE_BALANCE_LARGE;
    return data.min as string;
  } catch (e) {
    console.error(`Failed to get min storage balance on ${nep141Address}:`, e);
    return FT_MINIMUM_STORAGE_BALANCE_LARGE;
  }
};
