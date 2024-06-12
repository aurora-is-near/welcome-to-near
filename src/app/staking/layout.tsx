"use client";
import ConnectAccount from "@/components/Staking/components/ConnectAccount";
import LayoutWrapper from "@/components/Staking/components/LayoutWrapper";
import { setIntialStakingPage } from "@/components/Staking/routing";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { accountId } = useWalletSelector();
  const pathname = usePathname();

  useEffect(() => {
    setIntialStakingPage(pathname);
  }, []);

  if (accountId === null && pathname !== "/staking") {
    return (
      <LayoutWrapper title="Staking" color="violet">
        <ConnectAccount />;
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper title="Staking" color="violet">
      {children}
    </LayoutWrapper>
  );
}
