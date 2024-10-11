import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { ArrowRigthLeft } from "@/icons";
import React, { useEffect, useState } from "react";

type FreeTxData = {
  max: number;
  left: number;
  next_reset: string | null;
};
const fetchFreeTxInfo = async (
  accountId: string
): Promise<FreeTxData | null> => {
  try {
    const url = process.env.ethRpcForNear;
    if (!url) return null;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "near_getFreeTransactionsInfo",
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

  const [data, setData] = useState<FreeTxData | null>(null);

  useEffect(() => {
    if (!accountId || isEthereumWallet === false) {
      setData(null);
      return;
    }

    function getFreeTx(accountId: string) {
      fetchFreeTxInfo(accountId).then((result) => {
        if (result === null) return;
        setData(result);
      });
    }

    getFreeTx(accountId);

    const intervalId = setInterval(() => getFreeTx(accountId), 7000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [accountId, isEthereumWallet]);

  return data;
};

export default function FreeTransactionCounter({
  left,
  max,
}: {
  left?: number;
  max?: number;
}) {
  if (!left || !max) return null;
  const fillPercentage = Math.floor((left / max) * 100);
  return (
    <div className="relative h-10 w-[86px] overflow-hidden rounded-full border border-sand-6 bg-sand-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-12 lg:w-[182px]">
      <div
        style={{
          width: `${fillPercentage}%`,
        }}
        className="-z-1 absolute bottom-0 left-0 right-0 top-0 w-[50%] rounded-full bg-green-9 opacity-70 transition-[width] duration-700"
      ></div>
      <div className="relative z-10 flex h-10 w-full select-none items-center justify-center space-x-1 text-nowrap px-3 py-2">
        <ArrowRigthLeft className="text-sand-12" />
        <span className="text-sm font-semibold text-sand-12">{left}</span>
        <span className="text-xs text-sand-10">{"/"}</span>
        <span className="text-xs text-sand-10">
          {max}{" "}
          <span className="hidden lg:inline-block">free transactions</span>
        </span>
      </div>
    </div>
  );
}
