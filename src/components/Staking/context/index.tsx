"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { validators } from "@/utils/near";
import BN from "bn.js";
import { Validator, prepareValidatorsData, resetValidator } from "../utils";
import {
  addOrRemoveValidatorOnCondition,
  calcBalanceDiff,
  persistRecentValidators,
  processValidatorsBatch,
} from "./utils";
import sleep from "@/utils/sleep";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { usePathname } from "next/navigation";
import { loadRecentValidatorsMap } from "./latestValidatorsStorage";

type StakingContext = {
  stakedValidators: string[] | null;
  validatorsWithWithdrawAvailable: string[] | null;
  validatorsWithUnclaimedFarmingReward: string[] | null;
  validatorsWithAnyUserFunds: string[] | null;
  validators: Record<string, Validator>;
  initStakingContext: (accountId: string) => Promise<void>;
  updateAfterAction: (accountId: string, validatorId: string) => Promise<void>;
  stakingBalances: StakingBalances;
  state: STAKING_CONTEXT_STATE;
};

export type StakingBalances = {
  totalUnstaked: string | null;
  totalStaked: string | null;
  totalAvailable: string | null;
  totalPending: string | null;
  canUnstake: boolean | null;
  canWithdraw: boolean | null;
};

export enum STAKING_CONTEXT_STATE {
  NON_INITED,
  INITED,
  FULLY_LOADED,
}
type StakingState = {
  stakedValidators: string[] | null;
  validatorsWithWithdrawAvailable: string[] | null;
  validatorsWithUnclaimedFarmingReward: string[] | null;
  validatorsWithAnyUserFunds: string[] | null;
  validators: Record<string, Validator>;
  balances: StakingBalances;
  state: STAKING_CONTEXT_STATE;
};

enum ACTIONS {
  ADD_VALIDATORS,
  SET_STATE,
  RESET,
  UPDATE_AFTER_ACTION,
}

export type STAKING_ACTIONS = "stake" | "unstake" | "withdraw" | "claim";

type UpdateStakingBalancePayload = {
  totalUnstaked: BN;
  totalStaked: BN;
  totalAvailable: BN;
  totalPending: BN;
};

export type addValidatorsPayload = {
  validators: Validator[];
  balances: UpdateStakingBalancePayload;
  validatorsWithStake: string[];
  validatorsWithWithdrawAvailable: string[];
  validatorsWithUnclaimedFarmingReward: string[];
  validatorsWithAnyUserFunds: string[];
};

type actions =
  | {
      type: ACTIONS.ADD_VALIDATORS;
      payload: addValidatorsPayload;
    }
  | {
      type: ACTIONS.SET_STATE;
      payload: STAKING_CONTEXT_STATE;
    }
  | {
      type: ACTIONS.RESET;
    }
  | {
      type: ACTIONS.UPDATE_AFTER_ACTION;
      payload: addValidatorsPayload;
    };

function updateStakingBalance(
  current: StakingBalances,
  update: UpdateStakingBalancePayload
): StakingBalances {
  const ZERO = new BN("0");
  let result = {} as StakingBalances;

  for (let key in update) {
    let currentValue = current[key as keyof UpdateStakingBalancePayload];
    let valueToAdd;

    if (currentValue !== null) {
      valueToAdd = new BN(currentValue);
    } else {
      valueToAdd = ZERO;
    }
    result[key as keyof UpdateStakingBalancePayload] = valueToAdd
      .add(update[key as keyof UpdateStakingBalancePayload])
      .toString();
  }

  if (new BN(result.totalStaked as string).gt(ZERO)) {
    result.canUnstake = true;
  }
  if (new BN(result.totalAvailable as string).gt(ZERO)) {
    result.canWithdraw = true;
  }
  return result;
}

function reducer(state: StakingState, action: actions): StakingState {
  switch (action.type) {
    case ACTIONS.ADD_VALIDATORS: {
      const {
        validators,
        balances,
        validatorsWithStake,
        validatorsWithWithdrawAvailable,
        validatorsWithUnclaimedFarmingReward,
        validatorsWithAnyUserFunds,
      } = action.payload;

      const validatorsMap = Object.assign({}, state.validators);

      validators.forEach((validator) => {
        validatorsMap[validator.accountId] = Object.assign({}, validator);
      });

      return {
        state: state.state,
        balances: updateStakingBalance(state.balances, balances),
        validators: validatorsMap,
        stakedValidators:
          state.stakedValidators === null
            ? validatorsWithStake
            : state.stakedValidators.concat(validatorsWithStake),
        validatorsWithWithdrawAvailable:
          state.validatorsWithWithdrawAvailable === null
            ? validatorsWithWithdrawAvailable
            : state.validatorsWithWithdrawAvailable.concat(
                validatorsWithWithdrawAvailable
              ),
        validatorsWithUnclaimedFarmingReward:
          state.validatorsWithUnclaimedFarmingReward === null
            ? validatorsWithUnclaimedFarmingReward
            : state.validatorsWithUnclaimedFarmingReward.concat(
                validatorsWithUnclaimedFarmingReward
              ),
        validatorsWithAnyUserFunds:
          state.validatorsWithAnyUserFunds === null
            ? validatorsWithAnyUserFunds
            : state.validatorsWithAnyUserFunds.concat(
                validatorsWithAnyUserFunds
              ),
      };
    }
    case ACTIONS.SET_STATE: {
      if (action.payload === state.state) return state;
      return Object.assign({}, state, { state: action.payload });
    }
    case ACTIONS.UPDATE_AFTER_ACTION: {
      const {
        validators,
        validatorsWithStake,
        validatorsWithWithdrawAvailable,
        validatorsWithUnclaimedFarmingReward,
        validatorsWithAnyUserFunds,
      } = action.payload;

      const updatedValidator = validators[0];
      const oldValidator = state.validators[updatedValidator.accountId];
      const newTotalAvailable = calcBalanceDiff(
        state.balances.totalAvailable!,
        oldValidator.available,
        updatedValidator.available
      );
      const newTotalStaked = calcBalanceDiff(
        state.balances.totalStaked!,
        oldValidator.staked,
        updatedValidator.staked
      );
      return {
        stakedValidators: addOrRemoveValidatorOnCondition(
          updatedValidator.accountId,
          validatorsWithStake.length > 0,
          state.stakedValidators || []
        ),
        validatorsWithWithdrawAvailable: addOrRemoveValidatorOnCondition(
          updatedValidator.accountId,
          validatorsWithWithdrawAvailable.length > 0,
          state.validatorsWithWithdrawAvailable || []
        ),
        validatorsWithUnclaimedFarmingReward: addOrRemoveValidatorOnCondition(
          updatedValidator.accountId,
          validatorsWithUnclaimedFarmingReward.length > 0,
          state.validatorsWithUnclaimedFarmingReward || []
        ),
        validatorsWithAnyUserFunds: addOrRemoveValidatorOnCondition(
          updatedValidator.accountId,
          validatorsWithAnyUserFunds.length > 0,
          state.validatorsWithAnyUserFunds || []
        ),
        state: state.state,
        balances: {
          totalUnstaked: calcBalanceDiff(
            state.balances.totalUnstaked!,
            oldValidator.unstaked,
            updatedValidator.unstaked
          ).diff,
          totalStaked: newTotalStaked.diff,
          canUnstake: !newTotalStaked.isZero,
          totalAvailable: newTotalAvailable.diff,
          totalPending: calcBalanceDiff(
            state.balances.totalPending!,
            oldValidator.pending,
            updatedValidator.pending
          ).diff,
          canWithdraw: !newTotalAvailable.isZero,
        },
        validators: Object.assign({}, state.validators, {
          [updatedValidator.accountId]: updatedValidator,
        }),
      };
    }
    case ACTIONS.RESET: {
      return {
        validators: state.validators,
        stakedValidators: null,
        validatorsWithWithdrawAvailable: null,
        validatorsWithUnclaimedFarmingReward: null,
        validatorsWithAnyUserFunds: null,
        state: STAKING_CONTEXT_STATE.NON_INITED,
        balances: {
          totalUnstaked: null,
          totalStaked: null,
          canUnstake: null,
          totalAvailable: null,
          totalPending: null,
          canWithdraw: null,
        },
      };
    }
    default:
      throw new Error();
  }
}

const initialState: StakingState = {
  validators: {},
  stakedValidators: null,
  validatorsWithWithdrawAvailable: null,
  validatorsWithUnclaimedFarmingReward: null,
  validatorsWithAnyUserFunds: null,
  state: STAKING_CONTEXT_STATE.NON_INITED,
  balances: {
    totalUnstaked: null,
    totalStaked: null,
    canUnstake: null,
    totalAvailable: null,
    totalPending: null,
    canWithdraw: null,
  },
};

const StakingContext = createContext({} as StakingContext);

export const useStaking = () => {
  const context = useContext(StakingContext);
  if (!context) {
    throw new Error("useStaking must be used within StakingProvider");
  }
  return context;
};

type StakingRef = {
  currentAccount: string | null;
  isCurrentPageStaking: boolean;
  sleepTillBackToStakingPagePromise: Promise<void> | null;
  restoreLoad: ((value: void) => void) | null;
};

export function StakingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { accountId } = useWalletSelector();
  const ref = useRef<StakingRef>({
    currentAccount: null,
    isCurrentPageStaking: false,
    sleepTillBackToStakingPagePromise: null,
    restoreLoad: null,
  });
  const pathname = usePathname();

  const initStakingContext = useCallback(async (accountId: string) => {
    dispatch({
      type: ACTIONS.SET_STATE,
      payload: STAKING_CONTEXT_STATE.INITED,
    });
    const result = await validators();
    if (result == null) return;
    loadRecentValidatorsMap(accountId);
    const formattedValidators = prepareValidatorsData(accountId, result);
    const BATCH_SIZE = 10;
    let from = 0;
    while (from < formattedValidators.length) {
      let to = from + BATCH_SIZE;
      if (to > formattedValidators.length) to = formattedValidators.length;
      // Stop preparing validators data in case of user logout and account switches
      if (ref.current.currentAccount !== accountId) {
        return;
      }
      const data = persistRecentValidators(
        accountId,
        await processValidatorsBatch(
          accountId,
          formattedValidators.slice(from, to)
        )
      );

      if (!ref.current.isCurrentPageStaking) {
        await ref.current.sleepTillBackToStakingPagePromise;
      }
      // Stop preparing validators data in case of user logout and account switches
      if (ref.current.currentAccount !== accountId) {
        return;
      }
      dispatch({
        type: ACTIONS.ADD_VALIDATORS,
        payload: data,
      });
      await sleep(1000);
      from += BATCH_SIZE;
    }
    dispatch({
      type: ACTIONS.SET_STATE,
      payload: STAKING_CONTEXT_STATE.FULLY_LOADED,
    });
  }, []);

  useEffect(() => {
    const accNotNull = accountId !== null;
    const isStakingPage = pathname.includes("staking");
    ref.current.isCurrentPageStaking = isStakingPage;

    const wait = ref.current.sleepTillBackToStakingPagePromise !== null;

    // If user is not on a staking page stop loading of validators
    if (
      !isStakingPage &&
      !wait &&
      state.state === STAKING_CONTEXT_STATE.INITED
    ) {
      ref.current.sleepTillBackToStakingPagePromise = new Promise((resolve) => {
        ref.current.restoreLoad = resolve;
      });
    }

    if (!isStakingPage && state.state === STAKING_CONTEXT_STATE.NON_INITED)
      return;

    // If user goes back to stacking page continue loading of validators
    if (isStakingPage && wait && ref.current.restoreLoad !== null) {
      ref.current.restoreLoad();
      ref.current.sleepTillBackToStakingPagePromise = null;
      ref.current.restoreLoad = null;
    }

    // Initial staking context init
    if (isStakingPage && accNotNull && ref.current.currentAccount === null) {
      ref.current.currentAccount = accountId;
      initStakingContext(accountId);
      return;
    }

    // Wallet change
    if (accNotNull && ref.current.currentAccount !== accountId) {
      ref.current.currentAccount = accountId;
      if (wait && ref.current.restoreLoad !== null) {
        ref.current.restoreLoad();
        ref.current.sleepTillBackToStakingPagePromise = null;
        ref.current.restoreLoad = null;
      }

      dispatch({
        type: ACTIONS.RESET,
      });
      initStakingContext(accountId);
      return;
    }

    // disconnect wallet
    if (!accNotNull && ref.current.currentAccount !== null) {
      ref.current.currentAccount = null;
      // if load was stopped reset it
      if (wait && ref.current.restoreLoad !== null) {
        ref.current.restoreLoad();
        ref.current.sleepTillBackToStakingPagePromise = null;
        ref.current.restoreLoad = null;
      }
      dispatch({
        type: ACTIONS.RESET,
      });
      return;
    }
  }, [accountId, pathname, state.state]);

  const contextState = useMemo(() => {
    return {
      stakedValidators: state.stakedValidators,
      validatorsWithWithdrawAvailable: state.validatorsWithWithdrawAvailable,
      validatorsWithUnclaimedFarmingReward:
        state.validatorsWithUnclaimedFarmingReward,
      validatorsWithAnyUserFunds: state.validatorsWithAnyUserFunds,
      validators: state.validators,
      stakingBalances: state.balances,
      state: state.state,
      initStakingContext,
      updateAfterAction: async (accountId: string, validatorId: string) => {
        try {
          const validator = state.validators[validatorId];
          if (!validator) return;
          const data = persistRecentValidators(
            accountId,
            await processValidatorsBatch(accountId, [resetValidator(validator)])
          );
          // Stop the update of data in case of user logout and account switches
          if (ref.current.currentAccount !== accountId) {
            return;
          }
          dispatch({
            type: ACTIONS.UPDATE_AFTER_ACTION,
            payload: data,
          });
        } catch (e) {
          console.error("FAILED: to updateAfterAction", e);
        }
      },
    };
  }, [state]);

  return (
    <StakingContext.Provider value={contextState}>
      {children}
    </StakingContext.Provider>
  );
}
