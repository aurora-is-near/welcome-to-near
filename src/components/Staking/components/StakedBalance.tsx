import React from "react";
import NearLogo from "./NearLogo";
import Button from "../../Button";
import { Clock } from "@/icons";
import Tooltip from "@/components/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Card, CardPadding } from "@/components/Card";

export default function StakedBalance({
  totalStaked,
  canUnstake,
  totalPending,
  totalAvailable,
  canWithdraw,
  unstakeHref,
  withdrawHref,
}: {
  totalStaked: string;
  totalPending: string;
  canUnstake: boolean;
  totalAvailable: string;
  canWithdraw: boolean;
  unstakeHref: string;
  withdrawHref: string;
}) {
  return (
    <Card>
      <CardPadding>
        <h2 className="font-sans text-2xl font-medium leading-[1.3] text-sand-12">
          Staked balance
        </h2>
        <div className="mt-6 space-y-8">
          <div className="relative space-y-8">
            <div className="absolute -bottom-12 left-5 top-4 z-0 -translate-x-1/2 border-l-2 border-dashed border-sand-7" />
            <BalanceItem
              amount={totalStaked}
              description="Total amount staked"
              active={canUnstake}
              tooltipText="NEAR tokens currently staked with validators. These tokens are accumulating rewards. To access these tokens, you must first unstake and then withdraw them."
              actionButton={
                <Button
                  style="light-border"
                  size="sm"
                  className="!text-sand-12"
                  disabled={!canUnstake}
                  href={unstakeHref}
                  data-testid="unstake-stake-button"
                >
                  Unstake
                </Button>
              }
            />
            <BalanceItem
              amount={totalPending}
              description="Pending release"
              active={false}
              tooltipText="These tokens have been unstaked, but are not yet ready to withdraw. Tokens are ready to withdraw 52 to 65 hours after unstaking."
              actionButton={
                <Button
                  disabled
                  size="sm"
                  className="!bg-sand-3 !text-sand-8"
                  data-testid="release-stake-button"
                >
                  <Clock className="h-4.5 w-4.5" />
                  Pending
                </Button>
              }
            />
          </div>
          <BalanceItem
            amount={totalAvailable}
            description="Available for withdrawal"
            active={canWithdraw}
            tooltipText="These tokens have been unstaked, and are ready to be withdrawn."
            actionButton={
              <Button
                disabled={!canWithdraw}
                href={withdrawHref}
                className="!h-10 !w-fit !px-5 !text-sm !font-semibold !tracking-[0.28px]"
                data-testid="withdraw-stake-button"
              >
                Withdraw
              </Button>
            }
          />
        </div>
      </CardPadding>
    </Card>
  );
}

function BalanceItem({
  amount,
  description,
  active,
  actionButton,
  tooltipText,
}: {
  amount: string;
  description: string;
  active: boolean;
  actionButton: React.JSX.Element;
  tooltipText: string;
}) {
  return (
    <div className="relative flex items-start gap-x-4">
      <div className="-mt-1 flex h-13 w-10 items-center justify-center bg-white">
        <NearLogo active={active} />
      </div>
      <div className="flex flex-1 flex-col items-start gap-x-4 gap-y-2 sm:flex-row sm:justify-between">
        <div>
          <p className="text-base font-semibold leading-normal tracking-wider text-sand-12">
            {amount}
          </p>
          <div className="flex items-center gap-x-2">
            <p className="text-sm leading-normal tracking-wider text-sand-11">
              {description}
            </p>
            <Tooltip content={tooltipText} tooltipClassname="!w-44">
              <InformationCircleIcon className="h-5 w-5 text-sand-8 group-hover:text-sand-11" />
            </Tooltip>
          </div>
        </div>
        {actionButton}
      </div>
    </div>
  );
}
