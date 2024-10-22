"use client";

import { useCallback } from "react";
import Link from "next/link";
import Avatar, { ethWalletAvatarInputFormatter } from "@/components/Avatar";
import Button from "@/components/Button";
import {
  ETHEREUM_WALLETS_CONNECTOR,
  useWalletSelector,
} from "@/contexts/WalletSelectorContext";
import midTruncate from "@/utils/midTruncate";
import { InjectedWalletBehaviour } from "@near-wallet-selector/core";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CopyToClipboard from "react-copy-to-clipboard";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  ClipboardIcon,
  Cog6ToothIcon,
  PowerIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { accountExplorerLink } from "@/utils/near";

const ConnectWalletButton = () => {
  const { modal, accountId, selector } = useWalletSelector();

  const handleSignOut = useCallback(async () => {
    if (selector === null) return;
    const wallet = await selector.wallet();
    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  }, [selector]);

  const connectWithEth = useCallback(async () => {
    try {
      const wallet = await selector.wallet(ETHEREUM_WALLETS_CONNECTOR);
      (wallet as InjectedWalletBehaviour).signIn({ contractId: "" });
    } catch (e) {
      console.error(e);
    }
  }, [selector]);

  return !!accountId ? (
    <div className="sm:justify-start flex justify-center">
      <Menu as="div" className="relative">
        <MenuButton className="flex h-10 items-center justify-center gap-2 rounded-full border border-sand-6 bg-sand-3 py-1.5 pl-1.5 pr-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-12">
          {({ active }) => (
            <>
              <Avatar inputString={ethWalletAvatarInputFormatter(accountId)} />
              <div className="sm:hidden text-sm font-semibold text-sand-12">
                {midTruncate(accountId)}
              </div>
              <div className="sm:block hidden select-none text-sm font-semibold text-sand-12">
                {midTruncate(accountId)}
              </div>
              <ChevronDownIcon
                className={clsx("h-5 w-5 transform text-sand-12 duration-100", {
                  "rotate-180": active,
                })}
              />
            </>
          )}
        </MenuButton>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-fit origin-top-right overflow-hidden rounded-2xl bg-sand-1 shadow-xl ring-1 ring-sand-6 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-2">
            <CopyToClipboard text={accountId ?? ""}>
              <MenuItem>
                <button className="flex w-full items-center gap-x-2 px-4 py-3 text-left text-sm font-semibold text-sand-11 data-[focus]:bg-sand-3 data-[focus]:text-sand-12">
                  <ClipboardIcon className="h-5 w-5 flex-shrink-0" />
                  Copy Address
                </button>
              </MenuItem>
            </CopyToClipboard>
            <MenuItem>
              <Link
                href="/account"
                className="flex w-full items-center gap-x-2 px-4 py-3 text-left text-sm font-semibold text-sand-11 data-[focus]:bg-sand-3 data-[focus]:text-sand-12"
              >
                <Cog6ToothIcon className="h-5 w-5 flex-shrink-0" />
                Account
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                href={accountExplorerLink(accountId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-x-2 px-4 py-3 text-left text-sm font-semibold text-sand-11 data-[focus]:bg-sand-3 data-[focus]:text-sand-12"
              >
                <GlobeAltIcon className="h-5 w-5 flex-shrink-0" />
                In Explorer
              </Link>
            </MenuItem>
            <MenuItem>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-x-2 px-4 py-3 text-left text-sm font-semibold text-sand-11 data-[focus]:bg-sand-3 data-[focus]:text-sand-12"
              >
                <PowerIcon className="h-5 w-5 flex-shrink-0" />
                Disconnect
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </div>
  ) : (
    <div className="sm:flex-row flex flex-col gap-2">
      <Button
        size="sm"
        onClick={() => {
          modal?.show();
        }}
      >
        Log in with NEAR
      </Button>
      <Button size="sm" className="!bg-[#5773ff]" onClick={connectWithEth}>
        Log in with Ethereum
      </Button>
    </div>
  );
};

export default ConnectWalletButton;
