import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { ArrowRigthLeft } from "@/icons";
import React, { useEffect, useState } from "react";

const fetchFreeTxLeft = async (accountId: string) => {
  try {
    const url = process.env.ethRpcForNear;
    if (!url) return;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "near_getFreeTransactionsLeft",
        params: [accountId],
      }),
    });
    const data = await result.json();

    return data.result;
  } catch {
    return null;
  }
};

export const useFreeTxAmount = () => {
  const { isEthereumWallet, accountId } = useWalletSelector();

  const [txLeft, setTxLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!accountId || isEthereumWallet === false) {
      setTxLeft(null);
      return;
    }

    function getFreeTx(accountId: string) {
      fetchFreeTxLeft(accountId).then((result) => {
        if (Number.isNaN(Number(result))) return;
        setTxLeft(result);
      });
    }

    getFreeTx(accountId);

    const intervalId = setInterval(() => getFreeTx(accountId), 7000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [accountId, isEthereumWallet]);

  return txLeft;
};

export default function FreeTransactionCounter({
  txLeft,
  maxFreeTx,
}: {
  txLeft: number | null;
  maxFreeTx: number | null;
}) {
  if (txLeft === null || maxFreeTx === null) return null;
  const fillPercentage = Math.floor((txLeft / maxFreeTx) * 100);
  return (
    <div className="relative w-[86px] overflow-hidden rounded-full border border-sand-6 bg-sand-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-12 lg:w-[182px]">
      <div
        style={{
          width: `${fillPercentage}%`,
        }}
        className="-z-1 absolute bottom-0 left-0 right-0 top-0 w-[50%] rounded-full bg-green-9 opacity-70"
      ></div>
      <div className="relative z-10 flex h-10 w-full select-none items-center justify-center space-x-1 text-nowrap px-3 py-2">
        <ArrowRigthLeft className="text-sand-12" />
        <span className="text-sm font-semibold text-sand-12">{txLeft}</span>
        <span className="text-xs text-sand-10">{"/"}</span>
        <span className="text-xs text-sand-10">
          {maxFreeTx}{" "}
          <span className="hidden lg:inline-block">free transactions</span>
        </span>
      </div>
    </div>
  );
}
