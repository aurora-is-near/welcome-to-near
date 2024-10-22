import React from "react";
import { Validator } from "../utils";
import Avatar from "../../Avatar";
import { formatNearTokenAmount } from "@/utils/formatter";
import ActivityIndicator from "./ActivityIndicator";
import Link from "next/link";
import clsx from "clsx";
import Tooltip from "@/components/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

const FARM_VALIDATOR_TEXT =
  "This validator grants staking rewards in a token other than NEAR.";

export default function ValidatorItem({
  validator,
  href,
  rightSide,
  className,
}: {
  validator: Validator;
  href: string;
  className?: string;
  rightSide: React.JSX.Element;
}) {
  return (
    <Link
      className={clsx("flex items-center justify-between gap-x-4", className)}
      href={href}
    >
      <Avatar inputString={validator.accountId} size="lg" className="mt-1" />
      <div className="flex flex-1 flex-col items-start gap-x-4 gap-y-2 sm:flex-row sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="max-w-44 overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-semibold leading-normal tracking-wider text-sand-12 sm:max-w-64">
              {validator.accountId}
            </span>
            <ActivityIndicator validator={validator} />
          </div>
          <span className="flex items-center gap-x-2 text-sm leading-normal tracking-wider text-sand-11">
            {validator.contractNotDeployedOrDontSupportStaking
              ? "Validator doesn’t support staking"
              : validator.fee !== null
                ? `${validator.fee.percentage}% fee`
                : ""}
            {validator.isFarmingValidator ? (
              <Tooltip content={FARM_VALIDATOR_TEXT}>
                <InformationCircleIcon className="h-5 w-5 text-sand-8 group-hover:text-sand-11" />
              </Tooltip>
            ) : null}
          </span>
        </div>
        {rightSide}
      </div>
    </Link>
  );
}

export function TokenAmount({ validator }: { validator: Validator }) {
  return (
    <div className="flex flex-col sm:items-end sm:text-right">
      <span className="text-base font-semibold leading-normal tracking-wider text-sand-12">
        {formatNearTokenAmount(validator.staked)} NEAR
      </span>
      <span className="text-sm leading-normal tracking-wider text-sand-11">
        Staked
      </span>
    </div>
  );
}
