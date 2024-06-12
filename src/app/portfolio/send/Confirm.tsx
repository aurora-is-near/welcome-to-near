import { useFinance } from "@/contexts/FinanceContext";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { useSend } from "./Send";
import { utils } from "near-api-js";
import {
  getMinStorageBalance,
  nearAccount,
  storageBalance,
} from "@/utils/near";
import Button from "@/components/Button";
import prettifyValue from "@/utils/prettifyValue";
import { useTokens } from "../useTokens";
import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import {
  FT_STORAGE_DEPOSIT_GAS,
  FT_TRANSFER_GAS,
  ONE_YOCTO_NEAR,
} from "@/constants/near";
import { isUserRejectedError } from "@/utils/isUserRejectedError";
import { CardPadding } from "@/components/Card";
import { sendGaEvent } from "@/utils/googleAnalytics";
import { Action } from "@near-wallet-selector/core";
import isFtExecutionError from "@/utils/isFtExecutionError";

const Confirm = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const { refetch } = useTokens();
  const { updateAccountState } = useFinance();
  const { selector, accountId } = useWalletSelector();
  const { next, values, setResult, selectedTokenInfo } = useSend();
  const { amount, recipient } = values;
  const [warning, setWarning] = useState("");

  useEffect(() => {
    async function checkIfReceiverExistsOrFounded() {
      const receiverAccount = await nearAccount(recipient);

      if (receiverAccount === null) {
        setWarning(
          "Recipient account has not been funded or doesn't exist, please double check the validity of the account"
        );
      } else {
        setWarning("");
      }
    }
    checkIfReceiverExistsOrFounded();
  }, [recipient]);

  const tokenUsdValue = selectedTokenInfo?.usdValue || 0;
  const amountUsdValue = +amount * tokenUsdValue;

  const transferNearToken = async () => {
    if (selector === null) return;
    const wallet = await selector.wallet();
    if (!accountId) throw new Error("Wallet not connected.");

    const unitsSendAmount = utils.format.parseNearAmount(amount);

    if (unitsSendAmount === null) {
      throw new Error("Invalid amount.");
    }

    const result = await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: recipient,
      actions: [
        {
          type: "Transfer",
          params: {
            deposit: unitsSendAmount,
          },
        },
      ],
    });

    if (!result) throw new Error("Failed to send transaction.");

    setResult(result);
    sendGaEvent({
      name: "send",
      parameters: {
        token: "NEAR",
      },
    });

    setTimeout(updateAccountState, 2000);
  };

  const transferNep141Token = async () => {
    if (!selectedTokenInfo) return;

    const tokenContract = selectedTokenInfo.contract;
    if (!tokenContract) return;

    if (selector === null) return;
    const wallet = await selector.wallet();
    if (!accountId) throw new Error("Wallet not connected.");

    const unitsSendAmount = parseUnits(
      amount,
      selectedTokenInfo.decimals
    ).toString();

    const balance = await storageBalance(recipient, tokenContract);

    console.log("Receiver storage balance", balance);

    const actions: Action[] =
      balance === null
        ? [
            {
              type: "FunctionCall",
              params: {
                methodName: "storage_deposit",
                args: {
                  account_id: recipient,
                  registration_only: true,
                },
                gas: FT_STORAGE_DEPOSIT_GAS,
                deposit: await getMinStorageBalance(tokenContract),
              },
            },
          ]
        : [];

    actions.push({
      type: "FunctionCall",
      params: {
        methodName: "ft_transfer",
        args: {
          receiver_id: recipient,
          amount: unitsSendAmount,
        },
        gas: FT_TRANSFER_GAS,
        deposit: ONE_YOCTO_NEAR,
      },
    });

    const result = await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: tokenContract,
      actions,
    });

    if (!result) throw new Error("Failed to send transaction.");

    setResult(result);
    sendGaEvent({
      name: "send",
      parameters: {
        token: tokenContract,
      },
    });

    setTimeout(refetch, 2000);
  };

  const submitTransaction = async () => {
    if (!selectedTokenInfo) return;

    setSending(true);
    setError("");

    try {
      if (selectedTokenInfo.symbol === "NEAR") {
        await transferNearToken();
      } else {
        await transferNep141Token();
      }

      setSending(false);

      next();
    } catch (error: any) {
      console.log(error);

      setSending(false);

      if (isUserRejectedError(error)) return;

      let errToDisplay = "Failed to send";
      const isContractError = isFtExecutionError(error.message);

      if (isContractError !== null) {
        errToDisplay = isContractError;
      } else if (error.message && typeof error.message === "string") {
        errToDisplay = error.message;
      } else if (typeof error === "string") {
        errToDisplay = error;
      }

      setError(errToDisplay);
    }
  };

  return (
    <CardPadding className="border-t border-sand-5">
      <dl className="space-y-4">
        <div className="flex items-start justify-between gap-x-4">
          <dt className="text-xs font-semibold leading-[1.4] tracking-wider text-sand-11">
            Recipient
          </dt>
          <dd className="pb-4.5 text-right">
            <div className="break-all text-xs font-semibold leading-[1.4] tracking-wider text-sand-12">
              {recipient}
            </div>
          </dd>
        </div>
        <div className="flex items-start justify-between gap-x-4">
          <dt className="text-xs font-semibold leading-[1.4] tracking-wider text-sand-11">
            Amount
          </dt>
          <dd className="text-right">
            <div className="text-xs font-semibold leading-[1.4] tracking-wider text-sand-12">
              {amount} {selectedTokenInfo?.symbol}
            </div>
            <div className="mt-0.5 text-xs leading-[1.4] tracking-wider text-sand-11">
              $
              {prettifyValue({
                value: amountUsdValue,
                maxDigits: 4,
              })}
            </div>
          </dd>
        </div>
      </dl>
      <Button
        className="mt-6 w-full"
        loading={sending}
        onClick={submitTransaction}
      >
        Confirm & send
      </Button>
      {warning && (
        <p className="mt-4 break-words text-center text-sm font-semibold text-red-8">
          {warning}
        </p>
      )}
      {error && (
        <p className="mt-4 break-words text-center text-sm font-semibold text-red-8">
          {error}
        </p>
      )}
    </CardPadding>
  );
};

export default Confirm;
