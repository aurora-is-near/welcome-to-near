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

function adjustGasForSwap(transactionsRef: Transaction[]) {
  for (let i = 0; i < transactionsRef.length; i++) {
    const tx = transactionsRef[i];
    for (let y = 0; y < tx.functionCalls.length; y++) {
      const action = tx.functionCalls[y];
      if (action.methodName === "ft_transfer_call") {
        action.gas = "100000000000000";
        return;
      }
    }
  }
}

const Swap: React.FC = () => {
  const { selector, modal, accountId } = useWalletSelector();
  const [swapState, setSwapState] = React.useState<"success" | "fail" | null>(
    null
  );
  const swapInProgress = useRef(false);
  const onSwap = async (transactionsRef: Transaction[]) => {
    try {
      if (swapInProgress.current) return;
      swapInProgress.current = true;
      const wallet = await selector.wallet();
      if (!accountId) throw NotLoginError;

      //adjust gas for swap
      adjustGasForSwap(transactionsRef);

      await wallet
        .signAndSendTransactions(
          WalletSelectorTransactions(transactionsRef, accountId)
        )
        .finally(() => {
          swapInProgress.current = false;
        });

      setSwapState("success");
      sendGaEvent({
        name: "swap",
        parameters: { status: "success" },
      });
    } catch (e) {
      setSwapState("fail");
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
      setState: setSwapState,
    };
  }, [swapState]);

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
