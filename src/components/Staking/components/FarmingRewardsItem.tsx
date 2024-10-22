import { Farm, Validator } from "../utils";
import Image from "next/image";
import Button from "@/components/Button";
import { formatUnits } from "viem";
import prettifyValue, { TOKEN_DEFAULT_DIGITS } from "@/utils/prettifyValue";
import AddTokenIcon from "@/components/AddTokenIcon";

const FarmingRewardsItem = ({
  farm,
  validator,
}: {
  farm: Farm;
  validator: Validator;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Image
          width={40}
          height={40}
          className="rounded-full"
          src={farm.token.icon}
          alt=""
        />
        <div>
          <p className="whitespace-nowrap text-base font-semibold leading-normal tracking-wider text-sand-12">
            {formatFarmBalance(farm.reward, farm.token.decimals)}{" "}
            {farm.token.symbol}
          </p>
          <div className="flex items-center gap-x-2">
            <p className="max-w-64 overflow-hidden overflow-ellipsis text-sm leading-normal tracking-wider text-sand-11">
              {validator.accountId}
            </p>
            <AddTokenIcon
              contract={farm.token.id}
              decimals={farm.token.decimals}
              symbol={farm.token.symbol}
            />
          </div>
          <span className="text-sm tracking-[0.28x] text-sand-11"></span>
        </div>
      </div>
      <Button
        size="sm"
        href={`/staking/claim/${validator.accountId}/${farm.id}`}
        style="green"
        className="sm:w-fit w-full"
      >
        Claim
      </Button>
    </div>
  );
};
export default FarmingRewardsItem;

const MIN_DISPLAYED_AVAILABLE = 0.001;

function formatFarmBalance(amount: string, decimals: number) {
  if (amount === "0") return amount;
  const amountNumber = +formatUnits(BigInt(amount), decimals);
  if (amountNumber < MIN_DISPLAYED_AVAILABLE)
    return `< ${MIN_DISPLAYED_AVAILABLE}`;
  return prettifyValue({
    value: amountNumber,
    maxDigits: TOKEN_DEFAULT_DIGITS,
  });
}
