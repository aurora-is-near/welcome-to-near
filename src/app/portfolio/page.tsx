"use client";

import Actions from "./Actions";
import Assets from "./Assets";
import { MotionConfig } from "framer-motion";
import { TokensProvider } from "./useTokens";
import CardsProvider from "./useCards";

const transition = { type: "ease", ease: "easeOut", duration: 0.2 };

const PortfolioPage = () => (
  <MotionConfig transition={transition}>
    <TokensProvider>
      <CardsProvider>
        <Actions />
        <Assets />
      </CardsProvider>
    </TokensProvider>
  </MotionConfig>
);

export default PortfolioPage;
