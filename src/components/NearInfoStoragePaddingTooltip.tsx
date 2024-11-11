import React from "react";
import Tooltip from "./Tooltip";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function NearInfoStoragePaddingTooltip({
  balancePadding,
}: {
  balancePadding: string;
}) {
  return (
    <Tooltip
      content={
        <>
          {balancePadding}
          &nbsp;NEAR of balance is an extra gas padding for TXs.
        </>
      }
    >
      <InformationCircleIcon className="h-5 w-5 text-sand-8 group-hover:text-sand-11" />
    </Tooltip>
  );
}
