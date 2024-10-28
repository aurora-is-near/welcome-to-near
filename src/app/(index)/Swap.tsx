"use client";
import React, { useMemo, useRef } from "react";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { SwapWidget, Transaction } from "@ref-finance/ref-sdk";

import {
  WalletSelectorTransactions,
  NotLoginError,
} from "@ref-finance/ref-sdk";
import { DEFAULT_TOKENS_LIST } from "@/constants/near";
import { sendGaEvent } from "@/utils/googleAnalytics";

const SUCCESS = "success";
const FAIL = "fail";
type WidgetState = typeof SUCCESS | typeof FAIL | null;

const Swap: React.FC = () => {
  const { selector, modal, accountId } = useWalletSelector();
  const [swapState, setSwapState] = React.useState<WidgetState>(null);
  const [tx, setTx] = React.useState<string | undefined>();
  const swapInProgress = useRef(false);

  const onSwap = async (transactionsRef: Transaction[]) => {
    try {
      if (swapInProgress.current || transactionsRef.length === 0) return;
      swapInProgress.current = true;
      const wallet = await selector.wallet();
      if (!accountId) throw NotLoginError;

      let ftTransferCallIndex: number = transactionsRef.length - 1;
      //adjust gas for swap and find ft_transfer_call to display a link to
      for (let i = 0; i < transactionsRef.length; i++) {
        const tx = transactionsRef[i];

        for (let y = 0; y < tx.functionCalls.length; y++) {
          const action = tx.functionCalls[y];
          if (action.methodName === "ft_transfer_call") {
            action.gas = "100000000000000";
            ftTransferCallIndex = i;
            break;
          }
        }
      }

      const result = await wallet
        .signAndSendTransactions(
          WalletSelectorTransactions(transactionsRef, accountId)
        )
        .finally(() => {
          swapInProgress.current = false;
        });

      setSwapState(SUCCESS);
      setTx(result ? result[ftTransferCallIndex].transaction.hash : undefined);
      sendGaEvent({
        name: "swap",
        parameters: { status: "success" },
      });
    } catch (e) {
      setSwapState(FAIL);
      setTx(undefined);
      sendGaEvent({
        name: "swap",
        parameters: { status: "fail" },
      });
    }
  };

  const handleSignIn = () => {
    modal.show();
  };

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  const connection = useMemo(() => {
    return { AccountId: accountId || "", isSignedIn: !!accountId };
  }, [accountId]);

  const transactionState = useMemo(() => {
    return {
      state: swapState,
      tx,
      setState: setSwapState,
    };
  }, [swapState, tx]);

  return (
    <SwapWidget
      darkMode
      className="!max-w-full"
      onSwap={onSwap}
      width=""
      onDisConnect={handleSignOut}
      connection={connection}
      transactionState={transactionState}
      onConnect={handleSignIn}
      defaultTokenList={DEFAULT_TOKENS_LIST}
      defaultTokenIn="NEAR"
    />
  );
};

export default Swap;
