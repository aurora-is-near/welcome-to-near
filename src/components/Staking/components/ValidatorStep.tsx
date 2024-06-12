import React from "react";
import BackButton from "../../BackButton";
import Button from "../../Button";
import InfoItem from "./InfoItem";
import { Validator } from "../utils";
import StakedBalance from "./StakedBalance";
import ActivityIndicator from "./ActivityIndicator";
import { Card, CardPadding } from "@/components/Card";
import FarmingRewardsItem from "./FarmingRewardsItem";

export default function ValidatorStep({
  validator,
  onBack,
  canStake,
  stakingBalanceData,
}: {
  validator: Validator;
  onBack: () => void;
  canStake: boolean;
  stakingBalanceData: {
    totalStaked: string;
    totalPending: string;
    totalAvailable: string;
    canWithdraw: boolean;
    canUnstake: boolean;
  };
}) {
  return (
    <>
      <Card>
        <div className="border-b border-sand-6 px-8 py-7">
          <div className="flex items-center justify-start gap-4">
            <BackButton onClick={onBack} />
            <span className="font-sans text-2xl font-medium">
              {validator.accountId}
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-4 flex flex-col gap-5">
            <InfoItem
              left="Validator status"
              right={
                <div className="flex items-center gap-1">
                  {validator.active ? "Active" : "Non Active"}
                  <ActivityIndicator validator={validator} />
                </div>
              }
            />
            <InfoItem
              left="Validator Fee"
              right={`${validator.fee?.percentage}%`}
            />
          </div>
          <Button
            disabled={!canStake}
            // loading={isLoading}
            // onClick={onSubmit}
            href={`/staking/stake/${validator.accountId}`}
            style="green"
            className="mt-6 w-full"
          >
            Stake my tokens
          </Button>
        </div>
      </Card>
      {validator.farms.length > 0 ? (
        <Card>
          <CardPadding className="!pb-0">
            <h2 className="font-sans text-2xl font-medium leading-[1.3] text-sand-12">
              Available For Claim
            </h2>
          </CardPadding>
          <CardPadding className="mt-6 !pt-0">
            <div className="space-y-8">
              {validator.farms.map((farm) => {
                return (
                  <FarmingRewardsItem
                    key={validator.accountId + farm.id + farm.token.id}
                    validator={validator}
                    farm={farm}
                  />
                );
              })}
            </div>
          </CardPadding>
        </Card>
      ) : null}
      <StakedBalance
        unstakeHref={`/staking/unstake/${validator.accountId}`}
        withdrawHref={`/staking/withdraw/${validator.accountId}`}
        totalStaked={stakingBalanceData.totalStaked}
        canUnstake={stakingBalanceData.canUnstake}
        totalPending={stakingBalanceData.totalPending}
        totalAvailable={stakingBalanceData.totalAvailable}
        canWithdraw={stakingBalanceData.canWithdraw}
      />
    </>
  );
}
