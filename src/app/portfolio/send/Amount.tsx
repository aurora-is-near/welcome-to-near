import Button from "@/components/Button";
import prettifyValue, { TOKEN_DEFAULT_DIGITS } from "@/utils/prettifyValue";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSend } from "./Send";
import clsx from "clsx";
import ErrorMessage from "@/components/ErrorMessage";
import { parseUnits } from "viem";

type Inputs = {
  amount: string;
};

const Amount = () => {
  const { next, previous, values, setValues, selectedTokenInfo } = useSend();
  const initialValue = values?.amount || "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      amount: initialValue,
    },
  });

  const amount = watch("amount");
  const usdPrice = selectedTokenInfo?.usdPrice;

  const onSubmit: SubmitHandler<Inputs> = ({ amount }) => {
    setValues({ ...values, amount });
    next();
  };

  const totalUsd = Number(usdPrice) * Number(amount);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="sm:p-8 overflow-hidden px-4 py-6">
        <label htmlFor="amount" className="sr-only">
          Amount to send
        </label>
        <div className="relative">
          <input
            id="amount"
            type="number"
            className={clsx(
              "h-18 w-full border-none pl-18 pr-18 text-center font-sans font-medium !leading-[1.3] text-sand-12 hide-spinners placeholder:text-sand-6",
              {
                "text-[42px]": amount.length <= 10,
                "text-4xl": amount.length > 10 && amount.length <= 16,
                "text-3xl": amount.length > 16,
              }
            )}
            onWheel={(e: any) => e.target.blur()}
            min={0}
            step="any"
            placeholder="0"
            {...register("amount", {
              required: true,
              validate: {
                positive: (v) => {
                  try {
                    return +v > 0 || "Enter a valid amount.";
                  } catch {
                    return "Enter a valid amount.";
                  }
                },
                lessThanBalance: (v) => {
                  try {
                    const bigNumAmount = BigInt(
                      parseUnits(v, selectedTokenInfo?.decimals!)
                    );
                    const balanceBigNum = BigInt(
                      selectedTokenInfo?.balance || "0"
                    );
                    return (
                      bigNumAmount <= balanceBigNum ||
                      `You don’t have enough ${selectedTokenInfo?.symbol}.`
                    );
                  } catch {
                    return `You don’t have enough ${selectedTokenInfo?.symbol}.`;
                  }
                },
              },
            })}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button
              size="xs"
              type="button"
              style="dark-border"
              className="border-opacity-30"
              onClick={() => {
                if (!selectedTokenInfo?.formattedBalance) return;

                setValue("amount", selectedTokenInfo?.formattedBalance);
              }}
            >
              Max
            </Button>
          </div>
        </div>
        <p className="mt-2.5 h-[21px] text-center text-sm font-semibold leading-normal tracking-wider text-sand-11">
          {totalUsd > 0 ? (
            <>
              $
              {prettifyValue({
                value: totalUsd,
              })}
            </>
          ) : null}
        </p>
        {errors.amount?.message && (
          <ErrorMessage className="mt-4">{errors.amount.message}</ErrorMessage>
        )}
      </div>
      {selectedTokenInfo && (
        <div className="border-y border-sand-5">
          <div className="sm:px-8 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-4 text-left">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-sand-4">
                  {selectedTokenInfo.iconSrc && (
                    <Image
                      src={selectedTokenInfo.iconSrc}
                      height={40}
                      width={40}
                      alt=""
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-normal tracking-wider text-sand-12">
                    {selectedTokenInfo.symbol}
                  </h3>
                  <div className="flex items-center gap-x-2">
                    <p className="text-sm leading-normal tracking-wider text-sand-11">
                      {prettifyValue({
                        value: selectedTokenInfo.formattedBalance,
                        maxDigits: TOKEN_DEFAULT_DIGITS,
                      })}{" "}
                      {selectedTokenInfo.symbol}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                type="button"
                style="dark-border"
                className="border-opacity-30"
                onClick={previous}
              >
                Change asset
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="sm:p-8 px-4 py-6">
        <Button className="w-full">Continue</Button>
      </div>
    </form>
  );
};

export default Amount;
