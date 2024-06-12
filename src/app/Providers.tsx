"use client";
import { ReactNode } from "react";
import { WalletSelectorContextProvider } from "@/contexts/WalletSelectorContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { StakingProvider } from "@/components/Staking/context";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletSelectorContextProvider>
        <FinanceProvider>
          <StakingProvider>
            {children}
            <ProgressBar color="#21201c" options={{ showSpinner: false }} />
          </StakingProvider>
        </FinanceProvider>
      </WalletSelectorContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
