const STORAGE_KEY = "_lts-vldtrs-1";

const FLAG = "1";
type validatorRecords = Record<string, typeof FLAG>;
type validatorsWalletMap = Record<string, validatorRecords>;
const LATEST_VALIDATORS_MAP_PER_WALLET: validatorsWalletMap = {};

function makeKey(accountId: string) {
  return STORAGE_KEY + accountId;
}
export function loadRecentValidatorsMap(accountId: string): void {
  try {
    if (LATEST_VALIDATORS_MAP_PER_WALLET[accountId] !== undefined) return;
    const data = localStorage.getItem(makeKey(accountId));
    if (data === null) return;
    const parsedMap = JSON.parse(data) as validatorRecords;
    LATEST_VALIDATORS_MAP_PER_WALLET[accountId] = parsedMap;
  } catch (error) {
    console.error("Failed to load latest validators map", error);
  }
}

export function addRecentValidator(
  accountId: string,
  validators: string[]
): void {
  try {
    if (LATEST_VALIDATORS_MAP_PER_WALLET[accountId] === undefined) {
      LATEST_VALIDATORS_MAP_PER_WALLET[accountId] = {};
    }
    validators.forEach((validator) => {
      LATEST_VALIDATORS_MAP_PER_WALLET[accountId][validator] = FLAG;
    });

    persist(accountId, LATEST_VALIDATORS_MAP_PER_WALLET[accountId]);
  } catch (error) {
    console.error(error);
  }
}

export function checkIfRecentValidator(
  accountId: string,
  validator: string
): boolean {
  try {
    const accountData = LATEST_VALIDATORS_MAP_PER_WALLET[accountId];
    if (accountData === undefined) return false;
    return Boolean(accountData[validator]);
  } catch (error) {
    console.error("FAILED TO EXECUTE: checkIfRecentValidator", error);
    return false;
  }
}

function persist(accountId: string, map: validatorRecords): void {
  try {
    localStorage.setItem(makeKey(accountId), JSON.stringify(map));
  } catch (error) {
    console.error(error);
  }
}
