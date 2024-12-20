import prettifyValue, { TOKEN_DEFAULT_DIGITS } from "@/utils/prettifyValue";
import Image from "next/image";
import { useTokens } from "../useTokens";
import { useSend } from "./Send";
import { WRAP_NEAR } from "@/constants/near";
import { parseUnits } from "viem";

const SelectToken = () => {
  const { tokens } = useTokens();
  const { next, setSelectedToken } = useSend();

  return (
    <div className="pb-6 sm:pb-8">
      <div className="divide-y divide-sand-5 border-y border-sand-5">
        {tokens.map(
          ({
            symbol,
            balance,
            formattedBalance,
            usdValue,
            iconSrc,
            contract,
          }) => {
            const isWNEAR = contract === WRAP_NEAR.id;
            if (isWNEAR && BigInt(balance) < parseUnits("0.001", 24)) {
              return null;
            }
            if (!balance || balance === "0") return null;

            const prettyBalance = prettifyValue({
              value: formattedBalance,
              maxDigits: TOKEN_DEFAULT_DIGITS,
            });
            const prettyValue = prettifyValue({ value: usdValue });

            return (
              <button
                key={symbol}
                onClick={() => {
                  setSelectedToken(symbol);
                  next();
                }}
                className="inline-block w-full px-4 py-4 hover:bg-sand-2 sm:px-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-4 text-left">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-sand-4">
                      {iconSrc && (
                        <Image src={iconSrc} height={40} width={40} alt="" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold leading-normal tracking-wider text-sand-12">
                        {symbol}
                      </h3>
                      <div className="flex items-center gap-x-2">
                        <p className="text-sm leading-normal tracking-wider text-sand-11">
                          {prettyBalance} {symbol}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-base font-semibold leading-normal tracking-wider text-sand-12">
                    ${prettyValue}
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};

export default SelectToken;
