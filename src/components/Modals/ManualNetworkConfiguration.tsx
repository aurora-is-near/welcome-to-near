"use client";
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import clsx from "clsx";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from "../Button";
import { CopyIcon, Check } from "@/icons";
import config from "@/network-config.json";

enum NETWORKS {
  MAINNET = "Mainnet",
  TESTNET = "Testnet",
}
const TABS_ARRAY: NETWORKS[] = [NETWORKS.MAINNET, NETWORKS.TESTNET];

const CONFIG = {
  [NETWORKS.MAINNET]: [
    { type: "RPC URL", value: config.mainnet.ethRpcForNear },
    { type: "Chain Id", value: String(config.mainnet.chainId) },
    { type: "Currency Symbol", value: "NEAR" },
    { type: "Block explorer", value: config.mainnet.walletExplorerUrl },
  ],
  [NETWORKS.TESTNET]: [
    {
      type: "RPC URL",
      value: config.testnet.ethRpcForNear,
    },
    { type: "Chain Id", value: String(config.testnet.chainId) },
    { type: "Currency Symbol", value: "NEAR" },
    { type: "Block explorer", value: config.testnet.walletExplorerUrl },
  ],
};

const CopyButton = ({ valueToCopy }: { valueToCopy: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <CopyToClipboard text={valueToCopy} onCopy={onCopy}>
      <Button
        className={clsx("w-[58px] border-opacity-30 text-sand-10", {
          "!text-green-11": copied,
        })}
        style={copied ? "green" : "dark-border"}
        size="sm"
      >
        {copied ? (
          <Check className="h-[18px] w-[18px]" />
        ) : (
          <CopyIcon className="h-[18px] w-[18px]" />
        )}
      </Button>
    </CopyToClipboard>
  );
};

export default function ManualNetworkConfiguration({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<NETWORKS>(NETWORKS.MAINNET);

  useEffect(() => {
    return () => {
      setTimeout(() => setActiveTab(NETWORKS.MAINNET), 520);
    };
  }, [open]);
  return (
    <BaseModal
      show={open}
      onClose={onClose}
      paddingClassName="px-5 sm:p-0"
      mobileTitle={
        <span className="sm:hidden block text-base font-semibold tracking-[0.24px] text-sand-11">
          Manual wallet configuration
        </span>
      }
    >
      <div className="flex flex-col">
        <div className="sm:block hidden overflow-hidden rounded-t-2xl">
          <Tabs
            tabs={TABS_ARRAY}
            activeTab={activeTab}
            onClick={(value) => setActiveTab(value as NETWORKS)}
          />
        </div>
        <div className="px sm:hidden flex flex-col items-start gap-6">
          <div className="flex w-full flex-wrap justify-center gap-3">
            {TABS_ARRAY.map((network) => {
              const active = activeTab === network;
              return (
                <Button
                  key={network}
                  style={active ? "light-border" : "secondary"}
                  className={clsx("min-w-[162px] flex-1", {
                    "!text-sand-12": active,
                    "!text-sand-11": !active,
                  })}
                  onClick={() => setActiveTab(network)}
                >
                  {network}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="sm:p-8 pt-6">
          {CONFIG[activeTab].map((record, index, array) => (
            <React.Fragment key={record.type}>
              <RecordItem type={record.type} value={record.value} />
              {index !== array.length - 1 && (
                <div className="my-4 h-px w-full bg-sand-6"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}

const RecordItem = ({ type, value }: { type: string; value: string }) => {
  return (
    <div className="flex justify-between gap-8">
      <div className="flex flex-col items-start gap-1 text-left">
        <span className="text-xs font-semibold tracking-[0.24px] text-sand-11">
          {type}
        </span>
        <span className="break-words break-all text-sm font-semibold tracking-[0.24px] text-sand-12">
          {value}
        </span>
      </div>
      <CopyButton valueToCopy={value} />
    </div>
  );
};

const Tabs = ({
  tabs,
  activeTab,
  onClick,
}: {
  activeTab: string;
  onClick: (name: string) => void;
  tabs: string[];
}) => {
  return (
    <ul
      className="inline-flex w-full flex-1 flex-wrap text-center"
      role="tabgroup"
    >
      {tabs.map((name: string) => {
        const isActive = name === activeTab;
        return (
          <li
            className={clsx(
              "flex h-18 flex-1 items-center justify-center hover:cursor-pointer",
              {
                "bg-sand-6": !isActive,
              }
            )}
            role="presentation"
            key={name}
            onClick={() => onClick(name)}
          >
            <div
              className={clsx(
                "inline-block text-base font-semibold tracking-[0.32px] text-sand-11",
                {
                  "text-sand-12": isActive,
                }
              )}
              role="tab"
              aria-controls={name}
              aria-selected="false"
            >
              {name}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
