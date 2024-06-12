import React from "react";
import Tooltip from "./Tooltip";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function ConvertToNear({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip content="Convert to NEAR" tooltipClassname="w-fit text-nowrap">
      <ArrowPathIcon
        className="h-5 w-5 text-sand-8 group-hover:text-sand-11"
        onClick={onClick}
      />
    </Tooltip>
  );
}
