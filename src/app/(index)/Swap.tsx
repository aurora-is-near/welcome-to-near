"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { SwapWidget, Transaction } from "@ref-finance/ref-sdk";

import {
  WalletSelectorTransactions,
  NotLoginError,
} from "@ref-finance/ref-sdk";
import {
  DEFAULT_TOKENS_LIST,
  WRAP_NEAR_MAINNET,
  WRAP_NEAR_TESTNET,
} from "@/constants/near";
import { sendGaEvent } from "@/utils/googleAnalytics";
import { SwapState } from "@ref-finance/ref-sdk/dist/swap-widget/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IS_MAINNET } from "@/constants";

const REF_DEFAULT_TOKEN_IN = IS_MAINNET
  ? WRAP_NEAR_MAINNET.id
  : WRAP_NEAR_TESTNET.id;

const REF_DEFAULT_TOKEN_OUT = IS_MAINNET
  ? //aurora
    "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near"
  : "ref.fakes.testnet";

const LOCAL_STORAGE_TX_INDEX = "mnw_tx_i";
const saveMyNearWalletTxIndex = (index: string) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TX_INDEX, index);
  } catch (error) {
    console.error(error);
  }
};
const resetMyNearWalletTxIndex = () => {
  saveMyNearWalletTxIndex("");
};

export function myNearWalletTxIndex(): string | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_TX_INDEX);
    if (data === null || data === "") return null;
    return data;
  } catch (error) {
    return null;
  }
}

const Swap: React.FC = () => {
  const { selector, modal, accountId, isMyNearWallet } = useWalletSelector();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const txHash = searchParams.get("transactionHashes");
  const [swapState, setSwapState] = React.useState<SwapState>(null);
  const [tx, setTx] = React.useState<string | undefined>();
  const swapInProgress = useRef(false);

  // Show success screen after coming back from MyNearWallet
  useEffect(() => {
    if (txHash && isMyNearWallet) {
      try {
        setSwapState("success");

        const ftTransferCall =
          txHash.split(",")[Number(myNearWalletTxIndex()) || 0];
        setTx(ftTransferCall);

        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("transactionHashes");

        const newParamsString = newParams.toString();

        router.replace(
          pathname + newParamsString ? `?${newParamsString}#swap` : "#swap",
          {
            scroll: true,
          }
        );
      } finally {
        resetMyNearWalletTxIndex();
      }
    }
  }, [txHash, isMyNearWallet]);

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

      // save ft transfer call index to for my near wallet to display corret link to explorer
      if (isMyNearWallet) {
        saveMyNearWalletTxIndex(String(ftTransferCallIndex));
      } else {
        resetMyNearWalletTxIndex();
      }

      const result = await wallet
        .signAndSendTransactions(
          WalletSelectorTransactions(transactionsRef, accountId)
        )
        .finally(() => {
          swapInProgress.current = false;
        });

      if (!isMyNearWallet) {
        setSwapState("success");
        setTx(
          result ? result[ftTransferCallIndex].transaction.hash : undefined
        );
      }
      sendGaEvent({
        name: "swap",
        parameters: { status: "success" },
      });
    } catch (error) {
      if (error === "User canceled Ethereum wallet transaction(s).") {
        setSwapState(null);
        setTx(undefined);
        return;
      }
      setSwapState("fail");
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
      console.error("Failed to sign out");
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
      defaultTokenIn={REF_DEFAULT_TOKEN_IN}
      defaultTokenOut={REF_DEFAULT_TOKEN_OUT}
      minNearAmountLeftForGasFees={0.02}
    />
  );
};

export default Swap;
