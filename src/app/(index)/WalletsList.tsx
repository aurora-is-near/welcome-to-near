"use client";

import { EthereumLogo, NearLogo } from "@/icons";
import clsx from "clsx";
import Image from "next/image";

const nearWallets = [
  {
    name: "MyNearWallet",
    url: "https://mynearwallet.com",
    imgUrl: "/img/wallets/mynearwallet.png",
  },
  {
    name: "HERE wallet",
    url: "https://www.herewallet.app",
    imgUrl: "/img/wallets/here-wallet.png",
  },
  {
    name: "Meteor",
    url: "https://wallet.meteorwallet.app",
    imgUrl: "/img/wallets/meteor.png",
  },
];

const ethereumWallets = [
  {
    name: "MetaMask",
    url: "https://metamask.io/",
    imgUrl: "/img/wallets/metamask.png",
  },
  {
    name: "Brave Wallet",
    url: "https://brave.com/wallet/",
    imgUrl: "/img/wallets/brave.svg",
  },
  {
    name: "Aurora Pass",
    url: "https://auroracloud.dev/pass",
    imgUrl: "/img/wallets/aurorapass.png",
  },
  {
    name: "Rabby Wallet",
    url: "https://rabby.io/",
    imgUrl: "/img/wallets/rabby.png",
  },
  {
    name: "Zerion",
    url: "https://zerion.io/",
    imgUrl: "/img/wallets/zerion.png",
  },
];

const WalletList = ({ wallets }: { wallets: any[] }) => {
  return (
    <div
      className={clsx(
        "mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-6",
        {
          "max-w-[336px]": wallets.length <= 3,
          "max-w-[456px]": wallets.length > 6,
        }
      )}
    >
      {wallets.map(({ name, url, imgUrl }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex w-24 flex-col items-center justify-center"
        >
          <Image
            src={imgUrl}
            height={72}
            width={72}
            alt=""
            className="h-18 w-18 overflow-hidden rounded-2xl bg-white object-contain"
          />
          <p className="mt-2 line-clamp-1 text-center text-xs font-semibold leading-[1.4] tracking-wider text-green-11">
            {name}
          </p>
        </a>
      ))}
    </div>
  );
};

const WalletsList = () => {
  return (
    <div className="relative w-full divide-y divide-black/10 border-t border-black/15 bg-[#66DC96] xl:grid xl:grid-cols-2 xl:divide-x xl:divide-y-0">
      <div className="flex flex-col items-center px-4 py-6 sm:px-5 md:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#041417]">
            <NearLogo className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="font-sans text-xl font-medium leading-[1.3] tracking-wide text-green-12">
            Get a NEAR wallet
          </h3>
        </div>

        <WalletList wallets={nearWallets} />
      </div>

      <div className="relative flex flex-col items-center px-4 py-6 sm:px-5 md:p-7">
        <div className="flex items-center gap-3">
          <EthereumLogo className="h-8 w-8" />
          <h3 className="font-sans text-xl font-medium leading-[1.3] tracking-wide text-green-12">
            Get an Ethereum wallet
          </h3>
        </div>

        <WalletList wallets={ethereumWallets} />

        <div
          className="absolute left-1/2 top-0 z-10 flex h-13 w-13 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-none bg-[#66DC96] text-base font-semibold uppercase leading-normal tracking-wider text-green-11 xl:left-0 xl:top-1/2"
          aria-hidden="true"
        >
          or
        </div>
      </div>
    </div>
  );
};

export default WalletsList;
