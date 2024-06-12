import React from "react";
import Tooltip from "./Tooltip";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { addTokenToWallet } from "@/utils/addTokenToWallet";

export default function AddTokenIcon({
  contract,
  symbol,
  decimals,
}: {
  contract: string;
  symbol: string;
  decimals: number;
}) {
  return (
    <Tooltip content="Add token to wallet" tooltipClassname="w-fit text-nowrap">
      <PlusCircleIcon
        className="h-5 w-5 text-sand-8 group-hover:text-sand-11"
        onClick={() => addTokenToWallet(contract, symbol, decimals)}
      />
    </Tooltip>
  );
}
