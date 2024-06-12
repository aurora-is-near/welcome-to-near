"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { STAKING_ACTIONS, STAKING_CONTEXT_STATE, useStaking } from "./context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import ActionStep from "./components/ActionStep";
import { useFinance } from "@/contexts/FinanceContext";
import BN from "bn.js";
import { utils } from "near-api-js";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import {
  FARMING_CLAIM_GAS,
  FT_STORAGE_DEPOSIT_GAS,
  ONE_YOCTO_NEAR,
  STAKE_AND_DEPOSIT_GAS,
} from "@/constants/near";
import {
  getMinStorageBalance,
  storageBalance,
  txExplorerLink,
} from "@/utils/near";
import sleep from "@/utils/sleep";
import InfoItem from "./components/InfoItem";
import { formatNearTokenAmount } from "@/utils/formatter";
import ActivityIndicator from "./components/ActivityIndicator";
import Link from "next/link";
import { PencilSimple } from "@/icons";
import SuccessStep from "./components/SuccessStep";
import ErrorCard from "./components/ErrorCard";
import { goBack } from "./routing";
import {
  MIN_DISPLAYED_AVAILABLE,
  totalAvailableIsLessThanMinDisplayed,
} from "./hooks/useValidatorFormattedData";
import { DEFAULT_NEAR_VALUE } from ".";
import { isUserRejectedError } from "@/utils/isUserRejectedError";
import { Card } from "../Card";
import { Farm } from "./utils";
import { formatUnits } from "viem";
import { sendGaEvent } from "@/utils/googleAnalytics";
import { Transaction } from "@near-wallet-selector/core";

type Props =
  | {
      action: "stake" | "withdraw" | "unstake";
      actionData: {
        validatorAccountId: string;
      };
    }
  | {
      action: "claim";
      actionData: {
        validatorAccountId: string;
        farmId: string;
      };
    };

export default function Action({ action, actionData }: Props) {
  const { validators, state, updateAfterAction } = useStaking();
  const { accountId } = useWalletSelector();
  const { accountState, updateAccountState } = useFinance();
  const { selector } = useWalletSelector();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const txHash = searchParams.get("transactionHashes");
  const [error, setError] = useState("");
  const [txLink, setTxLink] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);
  const [amount, setAmount] = useState("");
  const [customCardError, setCustomCardError] = useState("");
  const [canRepeatAction, setCanRepeatAction] = useState(
    action === "claim" ? false : true
  );

  // Show success screen after coming back from MyNearWallet
  useEffect(() => {
    if (txHash) {
      try {
        setTxLink(txExplorerLink(txHash));

        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("transactionHashes");

        const newParamsString = newParams.toString();

        router.replace(
          pathname + newParamsString ? `?${newParamsString}` : "",
          {
            scroll: false,
          }
        );
      } catch (e) {
        console.error(
          "Failed to parse transactionHashes to display success step",
          e
        );
      }
    }
  }, [txHash]);

  const updateAfterStakingAction = useCallback(() => {
    try {
      if (!accountId) return;
      return Promise.all([
        updateAfterAction(accountId, actionData.validatorAccountId),
        updateAccountState(),
      ]);
    } catch (e) {
      console.error("FAILED: Update after staking action", e);
      return;
    }
  }, [updateAfterAction, updateAccountState]);
  const currentValidator = validators[actionData.validatorAccountId];
  const reset = useCallback(() => {
    setAmount("0");
    setError("");
    setTxLink("");
    setActionInProgress(false);
    setCanRepeatAction(true);
  }, []);
  let data = DATA[action];
  const {
    formattedMaxValue,
    setMax,
    onSubmit,
    infoItems,
    successDescriptionText,
    tokenIcon,
  } = useMemo(() => {
    // Since after a successful tx we don't send user to a new page
    // this hook can be recalculated even after a successful tx
    // be careful with possible error that may arise from reading undefined values after updates
    let maxValue = "0";
    let onSubmit = async (_amount: string) => {};
    let formattedMaxValue = "0";
    let successDescriptionText = <></>;
    let infoItems = <></>;
    let tokenIcon = "";

    if (
      accountState === null ||
      currentValidator === null ||
      currentValidator === undefined
    ) {
      return {
        formattedMaxValue: "0",
        setMax: () => {
          setAmount(utils.format.formatNearAmount(maxValue));
        },
        onSubmit,
        infoItems,
        successDescriptionText,
        tokenIcon,
      };
    }

    switch (action) {
      case "stake":
        maxValue = accountState.available;
        formattedMaxValue = `~${formatNearTokenAmount(maxValue)} NEAR`;
        infoItems = (
          <>
            <InfoItem
              left="Stake Amount"
              right={`${formatNearTokenAmount(currentValidator.staked)} NEAR`}
            />
            <InfoItem
              left={
                <Link
                  href={`/staking/${action}`}
                  className="flex items-center gap-2"
                >
                  Validator
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-sand-6">
                    <PencilSimple className="h-4 w-4" />
                  </div>
                </Link>
              }
              right={
                <div className="flex items-center gap-1">
                  {currentValidator.accountId}
                  <ActivityIndicator validator={currentValidator} />
                </div>
              }
            />
            <InfoItem
              left="Validator Fee"
              right={
                currentValidator.fee
                  ? `${currentValidator.fee.percentage}%`
                  : "unknown"
              }
            />
          </>
        );
        onSubmit = async function stake(amount: string) {
          try {
            if (selector === null) return;
            setError("");
            const trimmedAmount = amount.trim().replace(",", ".");
            if (trimmedAmount === "") throw { errorMessage: "Empty amount" };
            const formattedNumber = +trimmedAmount;
            if (Number.isNaN(formattedNumber))
              throw { errorMessage: "Not valid amount to stake" };
            const unitsStakeAmount =
              utils.format.parseNearAmount(trimmedAmount);
            if (unitsStakeAmount === null || unitsStakeAmount === "0")
              throw { errorMessage: "Not valid amount to stake" };
            if (accountState === null)
              throw { errorMessage: "Can't fetch near balance" };
            const stakeAmountBn = new BN(unitsStakeAmount);
            const nearBalanceBn = new BN(accountState.available);
            if (nearBalanceBn.isZero()) {
              throw { errorMessage: "You have no tokens" };
            }
            if (stakeAmountBn.gt(nearBalanceBn)) {
              throw { errorMessage: "Not enough balance" };
            }
            setActionInProgress(true);
            const validatorId = currentValidator.accountId;
            const wallet = await selector.wallet();
            const isMax =
              trimmedAmount ===
              utils.format.formatNearAmount(accountState.available);
            const result = await wallet.signAndSendTransaction({
              receiverId: validatorId,
              actions: [
                {
                  type: "FunctionCall",
                  params: {
                    // check stake_all
                    methodName: "deposit_and_stake",
                    args: {},
                    gas: STAKE_AND_DEPOSIT_GAS,
                    deposit: unitsStakeAmount,
                  },
                },
              ],
            });

            if (!result) throw { errorMessage: "Failed to stake" };
            console.log("stakeAndDepositTx", result);
            if (isMax) setCanRepeatAction(false);
            sendGaEvent({
              name: "staking",
              parameters: {
                action: "stake",
                validator: currentValidator.accountId,
              },
            });
            await sleep(2000);
            updateAfterStakingAction();
            setTxLink(txExplorerLink(result.transaction.hash));
            setAmount("");
          } catch (e: any) {
            console.error(e);
            if (isUserRejectedError(e)) {
              setError("Transaction rejected");
            } else {
              setError(e.errorMessage || "Failed to stake");
            }
          } finally {
            setActionInProgress(false);
          }
        };
        successDescriptionText = (
          <>
            Your stake has been successfully delegated to your chosen validator:{" "}
            <br />
            <span className="font-bold">{currentValidator.accountId}</span>
          </>
        );

        break;
      case "unstake":
        maxValue = currentValidator.staked;
        formattedMaxValue = `~${formatNearTokenAmount(maxValue)} NEAR`;
        infoItems = (
          <>
            <InfoItem
              left="Staked Amount"
              right={`${formatNearTokenAmount(currentValidator.staked)} NEAR`}
            />
            <InfoItem
              left={
                <Link
                  href={`/staking/${action}`}
                  className="flex items-center gap-2"
                >
                  Validator
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-sand-6">
                    <PencilSimple className="h-4 w-4" />
                  </div>
                </Link>
              }
              right={
                <div className="flex items-center gap-1">
                  {currentValidator.accountId}
                  <ActivityIndicator validator={currentValidator} />
                </div>
              }
            />
            <InfoItem
              left="Validator Fee"
              right={
                currentValidator.fee
                  ? `${currentValidator.fee.percentage}%`
                  : "unknown"
              }
            />
          </>
        );
        onSubmit = async function unstake(amount: string) {
          try {
            if (selector === null) return;
            setError("");
            const trimmedAmount = amount.trim().replace(",", ".");
            if (trimmedAmount === "") throw { errorMessage: "Empty amount" };
            const formattedNumber = +trimmedAmount;
            if (Number.isNaN(formattedNumber))
              throw { errorMessage: "Non valid amount to unstake" };
            const unitsUnstakeAmount =
              utils.format.parseNearAmount(trimmedAmount);
            if (unitsUnstakeAmount === null || unitsUnstakeAmount === "0")
              throw { errorMessage: "Non valid amount to unstake" };

            if (
              currentValidator.staked === null ||
              currentValidator.staked === undefined
            )
              throw { errorMessage: "No tokens to unstake" };

            const stakedAmount = new BN(currentValidator.staked);
            if (stakedAmount.isZero()) {
              throw {
                errorMessage: "No tokens to unstake",
              };
            }

            const unstakeAmountBn = new BN(unitsUnstakeAmount);

            if (unstakeAmountBn.gt(stakedAmount)) {
              throw {
                errorMessage:
                  "Unstake amount is greater than amount available for unstake",
              };
            }
            setActionInProgress(true);
            const wallet = await selector.wallet();
            const isMax =
              trimmedAmount ===
              utils.format.formatNearAmount(currentValidator.staked);
            const result = await wallet.signAndSendTransaction({
              receiverId: currentValidator.accountId,
              actions: [
                {
                  type: "FunctionCall",
                  params: isMax
                    ? {
                        methodName: "unstake_all",
                        args: {},
                        gas: STAKE_AND_DEPOSIT_GAS,
                        deposit: "0",
                      }
                    : {
                        methodName: "unstake",
                        args: {
                          amount: unitsUnstakeAmount,
                        },
                        gas: STAKE_AND_DEPOSIT_GAS,
                        deposit: "0",
                      },
                },
              ],
            });

            if (!result) throw { errorMessage: "Failed to unstake" };
            console.log("unstake tx", result);
            if (isMax) setCanRepeatAction(false);
            sendGaEvent({
              name: "staking",
              parameters: {
                action: "unstake",
                validator: currentValidator.accountId,
              },
            });
            await sleep(2000);
            updateAfterStakingAction();
            setTxLink(txExplorerLink(result.transaction.hash));
            setAmount("");
          } catch (e: any) {
            console.error(e);
            if (isUserRejectedError(e)) {
              setError("Transaction rejected");
            } else {
              setError(e.errorMessage || "Failed to unstake");
            }
          } finally {
            setActionInProgress(false);
          }
        };
        successDescriptionText = (
          <>
            You have successfully unstaked from validator:&nbsp;
            <br />
            <span className="font-bold">{currentValidator.accountId}</span>
          </>
        );

        break;
      case "withdraw":
        maxValue = currentValidator.available;
        formattedMaxValue =
          maxValue === "0"
            ? DEFAULT_NEAR_VALUE
            : totalAvailableIsLessThanMinDisplayed(maxValue)
              ? `${MIN_DISPLAYED_AVAILABLE} NEAR`
              : `~${formatNearTokenAmount(maxValue)} NEAR`;
        infoItems = (
          <>
            <InfoItem
              left="Available"
              right={`${formatNearTokenAmount(currentValidator.available)} NEAR`}
            />
            <InfoItem
              left={
                <Link
                  href={`/staking/${action}`}
                  className="flex items-center gap-2"
                >
                  Validator
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-sand-6">
                    <PencilSimple className="h-4 w-4" />
                  </div>
                </Link>
              }
              right={
                <div className="flex items-center gap-1">
                  {currentValidator.accountId}
                  <ActivityIndicator validator={currentValidator} />
                </div>
              }
            />
            <InfoItem
              left="Validator Fee"
              right={
                currentValidator.fee
                  ? `${currentValidator.fee.percentage}%`
                  : "unknown"
              }
            />
          </>
        );
        onSubmit = async function withdraw(amount: string) {
          try {
            if (selector === null) return;
            setError("");
            const trimmedAmount = amount.trim().replace(",", ".");
            if (trimmedAmount === "") throw { errorMessage: "Empty amount" };
            const formattedNumber = +trimmedAmount;
            if (Number.isNaN(formattedNumber))
              throw { errorMessage: "Non valid amount to withdraw" };
            const unitsWithdrawAmount =
              utils.format.parseNearAmount(trimmedAmount);
            if (unitsWithdrawAmount === null || unitsWithdrawAmount === "0")
              throw { errorMessage: "Non valid amount to withdraw" };

            if (
              currentValidator.available === null ||
              currentValidator.available === undefined
            )
              throw { errorMessage: "No tokens to withdraw" };

            const withdrawableAmountBn = new BN(currentValidator.available);
            if (withdrawableAmountBn.isZero()) {
              throw { errorMessage: "No tokens to withdraw" };
            }

            const withdrawAmountBn = new BN(unitsWithdrawAmount);
            if (withdrawAmountBn.gt(withdrawableAmountBn)) {
              throw {
                errorMessage:
                  "Withdraw amount is greater than amount available for withdrawal",
              };
            }
            setActionInProgress(true);
            const wallet = await selector.wallet();

            const isMax =
              trimmedAmount ===
              utils.format.formatNearAmount(currentValidator.available);
            const result = await wallet.signAndSendTransaction({
              receiverId: currentValidator.accountId,
              actions: [
                {
                  type: "FunctionCall",
                  params: isMax
                    ? {
                        methodName: "withdraw_all",
                        args: {},
                        gas: STAKE_AND_DEPOSIT_GAS,
                        deposit: "0",
                      }
                    : {
                        methodName: "withdraw",
                        args: {
                          amount: unitsWithdrawAmount,
                        },
                        gas: STAKE_AND_DEPOSIT_GAS,
                        deposit: "0",
                      },
                },
              ],
            });

            if (!result) throw { errorMessage: "Failed to withdraw" };
            console.log("withdraw tx", result);
            if (isMax) setCanRepeatAction(false);
            sendGaEvent({
              name: "staking",
              parameters: {
                action: "withdraw",
                validator: currentValidator.accountId,
              },
            });
            await sleep(10_000);
            updateAfterStakingAction();
            setTxLink(txExplorerLink(result.transaction.hash));
            setAmount("");
          } catch (e: any) {
            console.error(e);
            if (isUserRejectedError(e)) {
              setError("Transaction rejected");
            } else {
              setError(e.errorMessage || "Failed to withdraw");
            }
          } finally {
            setActionInProgress(false);
          }
        };
        successDescriptionText = (
          <>
            You have successfully withdrawn from validator:&nbsp;
            <span className="font-bold">{currentValidator.accountId}</span>
          </>
        );

        break;
      case "claim":
        let currentFarm = currentValidator.farms.find(
          (farm) => String(farm.id) === actionData.farmId
        ) as Farm;
        if (!currentFarm && !actionInProgress && !txLink) {
          setCustomCardError(
            "The farm that you try to claim reward in doesn't exist"
          );
          break;
        }
        if (currentFarm) {
          setAmount(
            formatUnits(BigInt(currentFarm.reward), currentFarm.token.decimals)
          );
          formattedMaxValue = "";
          infoItems = (
            <>
              <InfoItem
                left="Validator"
                right={
                  <div className="flex items-center gap-1">
                    {currentValidator.accountId}
                    <ActivityIndicator validator={currentValidator} />
                  </div>
                }
              />
              <InfoItem left="Token" right={currentFarm.token.symbol} />
            </>
          );
          tokenIcon = currentFarm.token.icon;
          onSubmit = async function () {
            try {
              if (accountId === null) return;
              if (selector === null) return;
              setError("");
              setActionInProgress(true);
              const wallet = await selector.wallet();
              const balance = await storageBalance(
                accountId,
                currentFarm.token.id
              );

              console.log("Receiver storage balance", balance);
              const transactions: Transaction[] = [];
              if (balance === null) {
                transactions.push({
                  signerId: accountId,
                  receiverId: currentFarm.token.id,
                  actions: [
                    {
                      type: "FunctionCall",
                      params: {
                        methodName: "storage_deposit",
                        args: {
                          account_id: accountId,
                          registration_only: true,
                        },
                        gas: FT_STORAGE_DEPOSIT_GAS,
                        deposit: await getMinStorageBalance(
                          currentFarm.token.id
                        ),
                      },
                    },
                  ],
                });
              }

              transactions.push({
                signerId: accountId,
                receiverId: currentValidator.accountId,
                actions: [
                  {
                    type: "FunctionCall",
                    params: {
                      methodName: "claim",
                      args: {
                        token_id: currentFarm.token.id,
                      },
                      gas: FARMING_CLAIM_GAS,
                      deposit: ONE_YOCTO_NEAR,
                    },
                  },
                ],
              });
              const result = await wallet.signAndSendTransactions({
                transactions,
              });

              if (!result) throw { errorMessage: "Failed to claim" };
              const claimTx = result[result.length - 1];
              console.log("claim tx", claimTx);
              sendGaEvent({
                name: "staking",
                parameters: {
                  action: "claim",
                  validator: currentValidator.accountId,
                  token: currentFarm.token.id,
                },
              });
              await sleep(2000);
              updateAfterStakingAction();
              setTxLink(txExplorerLink(claimTx.transaction.hash));
            } catch (e: any) {
              console.error(e);
              if (isUserRejectedError(e)) {
                setError("Transaction rejected");
              } else {
                setError(e.errorMessage || "Failed to claim");
              }
            } finally {
              setActionInProgress(false);
            }
          };
        }
        successDescriptionText = (
          <>
            You have successfully claimed reward from validator:&nbsp;
            <span className="font-bold">{currentValidator.accountId}</span>
          </>
        );

        break;
      default:
        break;
    }
    return {
      formattedMaxValue,
      setMax: () => {
        setAmount(utils.format.formatNearAmount(maxValue));
      },
      onSubmit,
      infoItems,
      successDescriptionText,
      tokenIcon,
    };
  }, [action, accountState, currentValidator, actionData]);

  if (!actionInProgress && (!currentValidator || accountState === null))
    return <ActionLoading />;

  if (!currentValidator && state === STAKING_CONTEXT_STATE.FULLY_LOADED) {
    return <ErrorCard error="Validator not found" />;
  }

  if (customCardError) {
    return <ErrorCard error={customCardError} />;
  }

  return txLink ? (
    <SuccessStep
      header={data.header}
      onBackHref="/staking"
      txLink={txLink}
      actionButtonText={data.actionButtonText}
      onActionButtonClick={reset}
      canRepeatAction={canRepeatAction}
      description={successDescriptionText}
    />
  ) : (
    <ActionStep
      header={data.header}
      amount={amount}
      subInputText={data.subInputText}
      onChange={setAmount}
      formattedMaxValue={formattedMaxValue}
      setMax={setMax}
      //TODO: Figure out how to stake max
      hideIsMax={data.hideIsMax}
      submitText={data.submitText}
      onSubmit={() => onSubmit(amount)}
      error={error}
      isLoading={actionInProgress}
      submitDisabled={actionInProgress}
      infoItems={infoItems}
      onBack={goBack(router)}
      inputDisabledByDefault={data.inputDisabledByDefault}
      tokenIcon={tokenIcon}
    />
  );
}

type actionData = {
  header: string;
  subInputText: string;
  submitText: string;
  actionButtonText: string;
  hideIsMax: boolean;
  inputDisabledByDefault: boolean;
};

const DATA: Record<STAKING_ACTIONS, actionData> = {
  stake: {
    header: "Stake",
    subInputText: "Available to stake",
    submitText: "Stake",
    actionButtonText: "Stake more",
    hideIsMax: false,
    inputDisabledByDefault: false,
  },
  unstake: {
    header: "Unstake",
    subInputText: "Available to unstake",
    submitText: "Unstake",
    actionButtonText: "Unstake more",
    hideIsMax: false,
    inputDisabledByDefault: false,
  },
  withdraw: {
    header: "Withdraw",
    subInputText: "Available to withdraw",
    submitText: "Withdraw",
    actionButtonText: "Withdraw more",
    hideIsMax: false,
    inputDisabledByDefault: false,
  },
  claim: {
    header: "Claim",
    subInputText: "Available to claim",
    submitText: "Claim",
    actionButtonText: "",
    hideIsMax: true,
    inputDisabledByDefault: true,
  },
};

const ActionLoading = () => {
  return (
    <Card className="flex h-[503px] max-w-[512px] flex-col items-center justify-center">
      <Spinner />
    </Card>
  );
};
