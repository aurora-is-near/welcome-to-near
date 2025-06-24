"use client";
import React, { useCallback, useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "../Button";
export default function BannedAddressConnected() {
  const { accountId, selector } = useWalletSelector();
  const [bannedEthWallet, setBannedEthWallet] = useState<boolean>(false);

  const handleSignOut = useCallback(async () => {
    if (selector === null) return;
    const wallet = await selector.wallet();
    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  }, [selector]);

  useEffect(() => {
    async function validateWallet() {
      try {
        if (!accountId) {
          setBannedEthWallet(false);
          return;
        }
        const response = await fetch(`/api/isBanned?address=${accountId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const payload = await response.json();
        setBannedEthWallet(Boolean(payload.isBanned));
      } catch {
        setBannedEthWallet(false);
      }
    }
    validateWallet();
  }, [accountId]);
  return (
    <BaseModal
      show={bannedEthWallet}
      showCloseButton={false}
      paddingClassName="px-5 sm:p-0"
      wrapperClassName="md:max-w-[600px]"
    >
      <div className="flex flex-col items-center pt-6 sm:p-8">
        <ExclamationTriangleIcon className="w-20" />
        <h2 className="text-center font-sans text-lg font-medium leading-[1.3] text-cyan-12 sm:text-4xl">
          Warning
        </h2>
        <p className="mt-2 text-center text-base leading-normal tracking-wider text-cyan-12 sm:mt-4">
          Your Ethereum (ETH) address has been restricted from use on the NEAR
          network. Please disconnect this address and connect a different one to
          continue. If you have any questions, feel free to&nbsp;
          <Link
            href={process.env.NEXT_PUBLIC_DISCORD_SUPPORT_URL}
            target="_blank"
            className="font-bold underline"
          >
            reach out to us on Discord
          </Link>
          .
        </p>
        <Button onClick={handleSignOut} className="mt-6 px-4 sm:mt-8">
          Disconnect
        </Button>
      </div>
    </BaseModal>
  );
}
