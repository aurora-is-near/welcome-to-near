"use client";
import React, { useMemo } from "react";
import ValidatorItem, { TokenAmount } from "./components/ValidatorItem";
import { useFinance } from "@/contexts/FinanceContext";
import { useStaking } from "./context";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import Balance from "./components/Balance";
import { formatNearTokenAmount } from "@/utils/formatter";
import StakedBalance from "./components/StakedBalance";
import Tooltip from "@/components/Tooltip";
import { Validator } from "./utils";
import useValidatorFormattedData, {
  formatTotalAvailable,
} from "./hooks/useValidatorFormattedData";
import ConnectAccount from "./components/ConnectAccount";
import { Card, CardPadding } from "../Card";
import ValidatorSkeleton from "./components/ValidatorSkeleton";
import FarmingRewardsItem from "./components/FarmingRewardsItem";

export const DEFAULT_NEAR_VALUE = "0 NEAR";

export default function Staking() {
  const { accountId } = useWalletSelector();
  const accountConnected = accountId !== null;
  const { accountState, isLoading } = useFinance();
  const {
    validators,
    validatorsWithAnyUserFunds,
    stakingBalances,
    validatorsWithUnclaimedFarmingReward,
  } = useStaking();

  const formattedStakingBalanceData = useMemo(() => {
    const result = {
      totalStaked:
        stakingBalances.totalStaked !== null
          ? `${formatNearTokenAmount(stakingBalances.totalStaked as string)} NEAR`
          : DEFAULT_NEAR_VALUE,
      totalPending:
        stakingBalances.totalPending !== null
          ? `${formatNearTokenAmount(stakingBalances.totalPending as string)} NEAR`
          : DEFAULT_NEAR_VALUE,
      totalAvailable:
        stakingBalances.totalAvailable !== null
          ? `${formatTotalAvailable(stakingBalances.totalAvailable)} NEAR`
          : DEFAULT_NEAR_VALUE,
      canWithdraw:
        stakingBalances.canWithdraw !== null
          ? stakingBalances.canWithdraw
          : false,
      canUnstake:
        stakingBalances.canUnstake !== null
          ? stakingBalances.canUnstake
          : false,
    };

    return result;
  }, [stakingBalances]);

  const formattedCurrentNearBalance = useMemo(() => {
    if (accountState === null || !accountConnected) {
      return null;
    }

    return +formatNearTokenAmount(accountState.available);
  }, [accountState, accountConnected]);

  const loading = validatorsWithAnyUserFunds === null;

  return (
    <>
      <Balance
        balance={formattedCurrentNearBalance}
        loading={isLoading}
        hasNear={Boolean(accountState?.hasNear)}
        loadingValidators={loading && accountConnected}
        accountConnected={accountConnected}
        stakeHref="/staking/stake"
      />
      <StakedBalance
        unstakeHref="/staking/unstake"
        withdrawHref="/staking/withdraw"
        totalStaked={formattedStakingBalanceData.totalStaked}
        canUnstake={formattedStakingBalanceData.canUnstake}
        totalPending={formattedStakingBalanceData.totalPending}
        totalAvailable={formattedStakingBalanceData.totalAvailable}
        canWithdraw={formattedStakingBalanceData.canWithdraw}
      />
      {!accountConnected ? (
        <ConnectAccount />
      ) : (
        <>
          {Array.isArray(validatorsWithUnclaimedFarmingReward) &&
          validatorsWithUnclaimedFarmingReward.length > 0 ? (
            <Card>
              <CardPadding className="!pb-0">
                <h2 className="font-sans text-2xl font-medium leading-[1.3] text-sand-12">
                  Available For Claim
                </h2>
              </CardPadding>
              <CardPadding className="mt-6 !pt-0">
                <div className="space-y-8">
                  {validatorsWithUnclaimedFarmingReward.map((validatorId) => {
                    const validator = validators[validatorId];
                    return validator.farms.map((farm) => {
                      return (
                        <FarmingRewardsItem
                          key={validator.accountId + farm.id + farm.token.id}
                          validator={validator}
                          farm={farm}
                        />
                      );
                    });
                  })}
                </div>
              </CardPadding>
            </Card>
          ) : null}
          <Card>
            <CardPadding className="!pb-0">
              <h2 className="font-sans text-2xl font-medium leading-[1.3] text-sand-12">
                Your Validators
              </h2>
            </CardPadding>
            <CardPadding className="mt-6 !pt-0">
              {(() => {
                if (loading) {
                  return <ValidatorSkeleton />;
                }
                if (validatorsWithAnyUserFunds.length === 0) {
                  return (
                    <span className="text-balance text-center text-sm text-sand-11">
                      You have no active stakes in validators.
                    </span>
                  );
                }
                return (
                  <div className="space-y-8">
                    {validatorsWithAnyUserFunds.map((validatorId) => {
                      const validator = validators[validatorId];
                      return (
                        <ValidatorItem
                          key={validator.publicKey}
                          validator={validator}
                          href={`/staking/${validator.accountId}`}
                          rightSide={
                            <div className="hidden sm:block">
                              <BalanceTooltip validator={validator}>
                                <TokenAmount validator={validator} />
                              </BalanceTooltip>
                            </div>
                          }
                        />
                      );
                    })}
                  </div>
                );
              })()}
            </CardPadding>
          </Card>
        </>
      )}
    </>
  );
}

const BalanceTooltip = ({
  children,
  validator,
}: {
  children: React.ReactNode;
  validator: Validator;
}) => {
  const formattedStakingBalanceData = useValidatorFormattedData(validator);
  return (
    <Tooltip
      tooltipClassname="!w-fit whitespace-nowrap"
      content={
        <div className="flex flex-col gap-1">
          <span>
            <span className="font-bold">Staked</span>:&nbsp;
            {formattedStakingBalanceData.totalStaked}
          </span>
          <span>
            <span className="font-bold">Unstaked</span>:&nbsp;
            {formattedStakingBalanceData.totalPending}
          </span>
          <span>
            <span className="font-bold">Withdrawable</span>:&nbsp;
            {formattedStakingBalanceData.totalAvailable}
          </span>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};
