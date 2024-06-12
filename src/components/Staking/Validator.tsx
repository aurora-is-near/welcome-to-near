"use client";
import { STAKING_CONTEXT_STATE, useStaking } from "./context";
import Spinner from "@/components/Spinner";
import ValidatorStep from "./components/ValidatorStep";
import { useRouter } from "next/navigation";
import { useFinance } from "@/contexts/FinanceContext";
import ErrorCard from "./components/ErrorCard";
import { goBack } from "./routing";
import useValidatorFormattedData from "./hooks/useValidatorFormattedData";
import { Card } from "../Card";

export default function Validator({
  validatorAccountId,
}: {
  validatorAccountId: string;
}) {
  const { validators, state } = useStaking();
  const { accountState } = useFinance();
  const router = useRouter();
  const validator = validators[validatorAccountId];

  const formattedStakingBalanceData = useValidatorFormattedData(validator);

  if (!validator && state === STAKING_CONTEXT_STATE.FULLY_LOADED)
    return <ErrorCard error="Validator not found" />;
  if (!validator) return <ValidatorLoading />;

  return (
    <ValidatorStep
      validator={validator}
      onBack={goBack(router)}
      canStake={Boolean(accountState?.hasNear)}
      stakingBalanceData={formattedStakingBalanceData}
    />
  );
}

const ValidatorLoading = () => {
  return (
    <div className="flex max-w-[512px] flex-col gap-3">
      <Card className="flex h-[301px] flex-col items-center justify-center">
        <Spinner />
      </Card>
      <Card className="flex h-[336px] flex-col items-center justify-center">
        <Spinner />
      </Card>
    </div>
  );
};
