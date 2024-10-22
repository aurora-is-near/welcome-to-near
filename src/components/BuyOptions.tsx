import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import { Binance, Coinbase, HTX, Munzen, OKX } from "@/icons";
import getWebsiteUrl from "@/utils/getWebsiteUrl";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const websiteUrl = getWebsiteUrl();

const getOnrampOptions = () => {
  const { accountId } = useWalletSelector();

  const baseUrl = "https://global.transak.com";
  const url = new URL(baseUrl);
  url.searchParams.append("defaultCryptoCurrency", "NEAR");
  url.searchParams.append("walletAddress", accountId ?? "");
  url.searchParams.append("redirectURL", websiteUrl);
  const transakUrl = url.toString();

  return [
    // {
    //   name: "MoonPay",
    //   url: "https://www.moonpay.com/buy/near",
    //   icon: (
    //     <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-sand-5 bg-white">
    //       <MoonPay className="h-5 w-5 text-[#7214F5]" />
    //     </div>
    //   ),
    // },
    // {
    //   name: "Transak",
    //   url: transakUrl,
    //   icon: <Transak className="h-10 w-10 flex-shrink-0" />,
    // },
    // {
    //   name: "Utorg",
    //   url: `https://app.utorg.pro/direct/wallet.near.org/${accountId}/?currency=NEAR`,
    //   icon: (
    //     <Image
    //       src="/img/utorg.png"
    //       alt=""
    //       height={96}
    //       width={96}
    //       className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-sand-5 object-cover"
    //     />
    //   ),
    // },
    {
      name: "Münzen",
      url: "https://widget.munzen.io/",
      icon: (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-sand-5 bg-white">
          <Munzen className="h-6 w-6" />
        </div>
      ),
    },
  ];
};

const exchangeOptions = [
  {
    name: "Binance",
    url: "https://www.binance.com/en/price/near-protocol",
    icon: <Binance className="h-10 w-10 flex-shrink-0" />,
  },
  {
    name: "Coinbase",
    url: "https://www.coinbase.com/price/near-protocol",
    icon: <Coinbase className="h-10 w-10 flex-shrink-0" />,
  },
  {
    name: "OKX",
    url: "https://www.okx.com/price/near-protocol-near",
    icon: <OKX className="h-10 w-10" />,
  },
  {
    name: "HTX",
    url: "https://www.htx.com/price/near/",
    icon: (
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-sand-5 bg-white">
        <HTX className="h-5 w-5" />
      </div>
    ),
  },
];

const ListItem = ({
  name,
  url,
  icon,
}: {
  name: string;
  url: string;
  icon: JSX.Element;
}) => (
  <a
    className="group flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-sand-2 sm:px-8"
    href={url}
    target="_blank"
    rel="noreferrer noopener"
  >
    <div className="flex items-center gap-4">
      {icon}
      <h4 className="text-base font-semibold leading-normal tracking-wider text-sand-12">
        {name}
      </h4>
    </div>
    <ChevronRightIcon className="h-6 w-6 text-sand-8 transition group-hover:translate-x-1 group-hover:text-sand-12" />
  </a>
);

const BuyOptions = ({ type }: { type: "onramps" | "exchanges" }) => {
  if (type === "onramps") {
    return getOnrampOptions().map((item) => (
      <ListItem
        key={item.name}
        name={item.name}
        url={item.url}
        icon={item.icon}
      />
    ));
  }

  if (type === "exchanges") {
    return exchangeOptions.map((item) => (
      <ListItem
        key={item.name}
        name={item.name}
        url={item.url}
        icon={item.icon}
      />
    ));
  }

  return null;
};

export default BuyOptions;
