import Button from "../../Button";
import clsx from "clsx";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Card, CardPadding } from "@/components/Card";
import Spinner from "@/components/Spinner";
import NearInfoStoragePaddingTooltip from "@/components/NearInfoStoragePaddingTooltip";

export default function Balance({
  balance,
  loading,
  loadingValidators,
  hasNear,
  stakeHref,
  accountConnected,
  balancePadding,
}: {
  balance: number | null;
  loading: boolean;
  accountConnected: boolean;
  loadingValidators: boolean;
  hasNear: boolean;
  stakeHref: string;
  balancePadding: string;
}) {
  return (
    <Card className="relative">
      <CardPadding className="flex flex-col gap-8">
        <div className="flex flex-col items-center">
          <div
            className={clsx(
              "text-center font-sans text-[42px] font-medium leading-[1.3]",
              loading ? "animate-pulse text-sand-7" : "text-sand-12"
            )}
          >
            <AnimatedNumber value={balance || 0} fractionDigits={4} /> NEAR
          </div>
          <div className="mt-2.5 flex items-center gap-1">
            <h2 className="text-sm font-semibold leading-normal tracking-wider text-sand-11">
              Available balance
            </h2>
            {accountConnected && (
              <NearInfoStoragePaddingTooltip balancePadding={balancePadding} />
            )}
          </div>
        </div>
        <Button
          href={stakeHref}
          style="green"
          disabled={!hasNear || loadingValidators}
        >
          Stake tokens
        </Button>
      </CardPadding>
      {loadingValidators && (
        <Spinner className="absolute right-4 top-4 opacity-50" size="sm" />
      )}
    </Card>
  );
}
