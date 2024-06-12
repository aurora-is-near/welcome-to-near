"use client";

import AnimatedNumber from "@/components/AnimatedNumber";
import { CreditCardIcon, ReceiveIcon, PaperPlaneIcon } from "@/icons";
import clsx from "clsx";
import { useCards } from "./useCards";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
import Send from "./send/Send";
import { useTokens } from "./useTokens";
import Receive from "./receive/Receive";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Card, CardPadding } from "@/components/Card";
import Buy from "./buy/Buy";

const Actions = () => {
  const searchParams = useSearchParams();
  const txHash = searchParams.get("transactionHashes");
  const { accountId } = useWalletSelector();
  const { activeCard, openCard } = useCards();
  const { tokens } = useTokens();
  const { totalUsdValue, isLoading } = useTokens();
  const [ref, bounds] = useMeasure();

  // Open send card after coming back from MyNearWallet
  useEffect(() => {
    if (txHash) {
      openCard("send");
    }
  }, [txHash]);

  const hasBalance = tokens.some(({ balance }) => balance && balance !== "0");

  return (
    <motion.div
      className="relative"
      animate={{
        height:
          Boolean(activeCard) && bounds.height > 0 ? bounds.height : "auto",
      }}
    >
      <motion.div
        animate={{
          opacity: Boolean(activeCard) ? 0 : 1,
        }}
      >
        <Card>
          <CardPadding>
            <div className="flex flex-col items-center justify-center">
              <div
                className={clsx(
                  "text-center font-sans text-[42px] font-medium leading-[1.3]",
                  isLoading ? "animate-pulse text-sand-7" : "text-sand-12"
                )}
              >
                $
                <AnimatedNumber
                  value={isLoading ? 0 : totalUsdValue}
                  fractionDigits={2}
                />
              </div>
              <h2 className="mt-2.5 text-center text-sm font-semibold leading-normal tracking-wider text-sand-11">
                Available balance
              </h2>
            </div>
            <div className="mt-8 grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  name: "Buy",
                  icon: CreditCardIcon,
                  action: () => {
                    openCard("buy");
                  },
                  disabled: !accountId,
                },
                {
                  name: "Send",
                  icon: PaperPlaneIcon,
                  action: () => openCard("send"),
                  disabled: !hasBalance,
                },
                {
                  name: "Receive",
                  icon: ReceiveIcon,
                  action: () => openCard("receive"),
                  disabled: !accountId,
                },
              ].map(({ name, icon: Icon, action, disabled = false }) => (
                <button
                  key={name}
                  onClick={action}
                  disabled={disabled}
                  className="flex flex-col items-center justify-center gap-y-2.5 rounded-2xl bg-green-3 px-8 py-5 text-green-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-11 disabled:opacity-50"
                >
                  <Icon className="h-8 w-8" />
                  <span className="text-sm font-semibold leading-normal tracking-wider">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </CardPadding>
        </Card>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {Boolean(activeCard) && (
          <motion.div
            key="card-container"
            className="absolute inset-0"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div ref={ref}>
              {activeCard === "send" && <Send />}
              {activeCard === "receive" && <Receive />}
              {activeCard === "buy" && <Buy />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Actions;
