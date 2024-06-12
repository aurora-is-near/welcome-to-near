import Button from "@/components/Button";
import { NearLogo } from "@/icons";
import supabase from "@/supabase/client";
import {
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import Chart from "./Chart";
import clsx from "clsx";
import { unstable_cache } from "next/cache";

const getPriceData = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("coingecko")
      .select("data")
      .eq("token", "near")
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data?.data;
  },
  ["near-price-data"],
  {
    revalidate: 900,
  }
);

const NearPrice = async () => {
  const priceData = await getPriceData();

  const { price, historicalPrices, oneDayChange } = priceData || {};

  const isPositive = oneDayChange >= 0;

  if (!price || !historicalPrices || oneDayChange === undefined) {
    return (
      <div className="mx-auto flex w-full items-center justify-center gap-x-2 rounded-2xl bg-sand-1 p-4 shadow-custom-lg ring-1 ring-black/[0.03] sm:p-6 md:max-w-lg lg:max-w-none">
        <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-sand-9" />
        <p className="text-center text-sm leading-normal tracking-wider text-sand-9">
          NEAR price data not available.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-2xl bg-sand-1 p-4 shadow-custom-lg ring-1 ring-black/[0.03] sm:p-6 md:max-w-lg lg:max-w-none">
      <div className="flex justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#01EC97] sm:h-16 sm:w-16">
            <NearLogo className="h-4.5 w-4.5 sm:h-[30px] sm:w-[30px]" />
          </div>
          <div>
            <p className="font-sans text-base font-medium leading-[1.3] tracking-wide text-sand-12 sm:text-xl">
              NEAR Protocol
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-normal tracking-wider text-sand-11 sm:mt-1.5 sm:text-base">
              NEAR
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 sm:gap-4">
          <div>
            <p className="text-right font-sans text-lg font-bold leading-none text-sand-12 sm:text-[28px]">
              ${+price.toFixed(2)}
            </p>
            <p className="mt-1 text-right text-xs font-semibold leading-[1.4] tracking-wider sm:mt-2.5">
              <span
                className={clsx(
                  "block sm:inline",
                  isPositive ? "text-green-11" : "text-red-11"
                )}
              >
                {isPositive && "+"}
                {+oneDayChange.toFixed(2)}%
              </span>
              <span className="ml-3 block text-sand-11 sm:inline">
                Last 24 hrs
              </span>
            </p>
          </div>
          <Button
            href="https://www.coingecko.com/en/coins/near"
            target="_blank"
            rel="noreferrer noopener"
            size="sm"
            className="w-10"
            style="light-border"
          >
            <span className="sr-only">Read more</span>
            <ArrowTopRightOnSquareIcon className="h-5 w-5 flex-shrink-0 text-sand-12" />
          </Button>
        </div>
      </div>

      <Chart prices={historicalPrices} />
    </div>
  );
};

export default NearPrice;
