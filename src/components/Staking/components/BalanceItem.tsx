import NearLogo from "./NearLogo";

export function BalanceItem({
  amount,
  description,
  active,
  actionButton,
}: {
  amount: string;
  description: string;
  active: boolean;
  actionButton: React.JSX.Element;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="min-w-10">
          <NearLogo active={active} />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold tracking-[0.32px] text-sand-12">
            {amount}
          </span>
          <span className="text-sm tracking-[0.28x] text-sand-11">
            {description}
          </span>
        </div>
      </div>
      {actionButton}
    </div>
  );
}
