import { useCards } from "./useCards";
import { motion } from "framer-motion";
import Image from "next/image";
import prettifyValue, { TOKEN_DEFAULT_DIGITS } from "@/utils/prettifyValue";
import { useTokens } from "./useTokens";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import ConnectAccount from "@/components/Staking/components/ConnectAccount";
import { Card, CardPadding } from "@/components/Card";
import AddTokenIcon from "@/components/AddTokenIcon";
import NearInfoStoragePaddingTooltip from "@/components/NearInfoStoragePaddingTooltip";
import { ONE_YOCTO_NEAR, WRAP_NEAR } from "@/constants/near";
import ConvertToNear from "@/components/ConvertToNear";
import { WalletSelector } from "@near-wallet-selector/core";
import { parseUnits } from "viem";

const Assets = () => {
  const { activeCard } = useCards();
  const { tokens, isLoading, refetch } = useTokens();
  const { accountId, selector, balancePadding } = useWalletSelector();

  if (!accountId) return <ConnectAccount />;
  if ((!isLoading && tokens.length === 0) || activeCard) return null;

  return (
    <motion.div>
      <Card>
        <CardPadding>
          <h2 className="font-sans text-2xl font-medium leading-[1.3] text-sand-12">
            Your assets
          </h2>
          <ul className="mt-4 space-y-8">
            {isLoading
              ? [1, 2].map((i) => (
                  <li key={i} className="animate-pulse">
                    <div className="flex items-center justify-between pb-px">
                      <div className="flex items-center gap-x-4">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-sand-4" />
                        <div>
                          <div className="my-1 h-4 w-10 rounded bg-sand-4" />
                          <div className="my-1 h-4 w-16 rounded bg-sand-4" />
                        </div>
                      </div>
                      <div className="h-5 w-16 rounded bg-sand-4" />
                    </div>
                  </li>
                ))
              : tokens.map(
                  ({
                    contract,
                    symbol,
                    balance,
                    formattedBalance,
                    usdValue,
                    decimals,
                    iconSrc,
                  }) => {
                    if (!balance || balance === "0") {
                      return null;
                    }
                    const isWNEAR = contract === WRAP_NEAR.id;
                    if (
                      isWNEAR &&
                      BigInt(balance) < parseUnits("0.001", decimals)
                    ) {
                      return null;
                    }
                    const prettyBalance = prettifyValue({
                      value: formattedBalance,
                      maxDigits: TOKEN_DEFAULT_DIGITS,
                    });
                    const prettyValue = prettifyValue({ value: usdValue });
                    const hideValue = !Boolean(Number(usdValue));

                    return (
                      <li key={symbol}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-sand-4">
                              {iconSrc && (
                                <Image
                                  src={iconSrc}
                                  height={40}
                                  width={40}
                                  alt=""
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="text-base font-semibold leading-normal tracking-wider text-sand-12">
                                {symbol}
                              </h3>
                              <div className="flex items-center gap-x-2">
                                <div className="flex items-center gap-x-2 text-sm leading-normal tracking-wider text-sand-11">
                                  {prettyBalance} {symbol}
                                  {contract && (
                                    <AddTokenIcon
                                      contract={contract}
                                      decimals={decimals}
                                      symbol={symbol}
                                    />
                                  )}
                                  {isWNEAR && (
                                    <ConvertToNear
                                      onClick={() =>
                                        convertWnearToNear({
                                          wNearBalance: balance,
                                          selector,
                                          refetch,
                                          accountId,
                                        })
                                      }
                                    />
                                  )}
                                </div>
                                {symbol === "NEAR" ? (
                                  <NearInfoStoragePaddingTooltip
                                    balancePadding={balancePadding}
                                  />
                                ) : null}
                              </div>
                            </div>
                          </div>
                          {!hideValue && (
                            <div className="text-base font-semibold leading-normal tracking-wider text-sand-12">
                              ${prettyValue}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  }
                )}
          </ul>
        </CardPadding>
      </Card>
    </motion.div>
  );
};

const convertWnearToNear = async ({
  wNearBalance,
  selector,
  refetch,
  accountId,
}: {
  wNearBalance: string;
  selector: WalletSelector;
  refetch: () => void;
  accountId: string;
}) => {
  try {
    if (selector === null) return;
    const wallet = await selector.wallet();
    if (!accountId) return;

    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: WRAP_NEAR.id,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "near_withdraw",
            args: { amount: wNearBalance },
            deposit: ONE_YOCTO_NEAR,
            gas: "80000000000000",
          },
        },
      ],
    });

    setTimeout(refetch, 2000);
  } catch (e) {
    console.error("Failed to convert wnear to near", e);
  }
};

export default Assets;
