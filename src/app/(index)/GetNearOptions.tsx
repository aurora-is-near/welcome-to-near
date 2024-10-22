"use client";
import Button from "@/components/Button";
import BuyOptions from "@/components/BuyOptions";
import { EthereumLogo } from "@/icons";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

const GetNearOptions = () => (
  <TabGroup className="mt-6 w-full sm:mt-8">
    <TabList className="grid grid-cols-2 gap-2">
      {["Bridge", "Onramps"].map((tab) => (
        <Tab key={tab} as={Fragment}>
          {({ selected }) => (
            <Button style={selected ? "primary" : "transparent"}>{tab}</Button>
          )}
        </Tab>
      ))}
    </TabList>
    <TabPanels className="mt-8">
      <TabPanel className="flex flex-col items-center justify-center gap-4 rounded-xl bg-[#212C3A] px-4 pb-7 pt-8">
        <div className="flex items-center gap-x-3">
          <EthereumLogo className="h-8 w-8 flex-shrink-0" />
          <h3 className="text-left font-sans text-lg font-medium leading-[1.3] tracking-wide text-violet-1">
            Bridge from Ethereum
          </h3>
        </div>
        <h3 className="text-center font-sans text-sm font-medium leading-[1.3] tracking-wide text-violet-3">
          ETH or ERC-20 (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7"
          >
            USDT
          </a>
          ,&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          >
            USDC
          </a>
          ,&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f"
          >
            DAI
          </a>
          ,&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://etherscan.io/address/0x3ea8ea4237344c9931214796d9417af1a1180770"
          >
            FLX
          </a>
          ,&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://etherscan.io/address/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
          >
            wBTC
          </a>
          ,&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://etherscan.io/address/0xaaaaaa20d9e0e2461697782ef11675f668207961"
          >
            Aurora
          </a>
          ) can be swapped to NEAR{" "}
          <a href="#swap" className="underline">
            here
          </a>
          . Bridging tokens also gives you a small reward in NEAR to pay
          transactions fees.
        </h3>
        <Button
          style="white"
          className="mt-2 w-full"
          href="https://rainbowbridge.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Rainbow Bridge
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-sand-dark-11" />
        </Button>
      </TabPanel>

      <TabPanel className="divide-y divide-sand-5 overflow-hidden rounded-xl border border-sand-5 bg-white">
        <BuyOptions type="onramps" />
      </TabPanel>

      <TabPanel className="divide-y divide-sand-5 overflow-hidden rounded-xl border border-sand-5 bg-white">
        <BuyOptions type="exchanges" />
      </TabPanel>
    </TabPanels>
  </TabGroup>
);

export default GetNearOptions;
