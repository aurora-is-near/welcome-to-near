import React from "react";
import Tooltip from "./Tooltip";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { NEAR_MAX_AMOUNT_PADDING } from "@/constants/near";

export default function NearInfoStoragePaddingTooltip() {
  return (
    <Tooltip
      content={
        <>
          {NEAR_MAX_AMOUNT_PADDING}
          &nbsp;NEAR of balance is an extra gas padding for TXs.
        </>
      }
    >
      <InformationCircleIcon className="h-5 w-5 text-sand-8 group-hover:text-sand-11" />
    </Tooltip>
  );
}
