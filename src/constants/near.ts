import { IS_MAINNET } from "@/constants";

export const FT_STORAGE_DEPOSIT_GAS = "30000000000000";
export const FT_TRANSFER_GAS = "15000000000000";
export const ONE_YOCTO_NEAR = "1";
export const FT_MINIMUM_STORAGE_BALANCE_LARGE = "12500000000000000000000";
export const STAKE_AND_DEPOSIT_GAS = "50000000000000";
export const FARMING_CLAIM_GAS = "150000000000000";
export const MIN_DISPLAY_YOCTO = "100";
export const DEFAULT_MAX_AMOUNT_PADDING = "0.0125";
export const BIGGER_MAX_AMOUNT_PADDING = "0.07";

type TokenInfo = {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
};

export const WRAP_NEAR_MAINNET = {
  id: "wrap.near",
  name: "Wrapped NEAR fungible token",
  symbol: "wNEAR",
  decimals: 24,
  icon: "/img/tokens/near.png",
};

export const WRAP_NEAR_TESTNET = {
  id: "wrap.testnet",
  symbol: "wNEAR",
  name: "wNEAR",
  decimals: 24,
  icon: "/img/tokens/near.png",
};

export const WRAP_NEAR = IS_MAINNET ? WRAP_NEAR_MAINNET : WRAP_NEAR_TESTNET;

const DEFAULT_TOKEN_TESTNET_LIST: TokenInfo[] = [
  {
    id: "ref.fakes.testnet",
    name: "REF",
    decimals: 18,
    symbol: "REF",
    icon: "/img/tokens/ref.png",
  },
  {
    id: "eth.sepolia.testnet",
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
    icon: "/img/tokens/eth.png",
  },
  WRAP_NEAR_TESTNET,
  {
    id: "usdtt.ft.ref-labs.testnet",
    symbol: "b-USDt",
    name: "USDt",
    decimals: 6,
    icon: "/img/tokens/usdt.png",
  },
  {
    id: "1c7d4b196cb0c7b01d743fbc6116a902379c7238.factory.sepolia.testnet",
    symbol: "USDT.e",
    name: "USDT.e",
    decimals: 6,
    icon: "/img/tokens/usdc.svg",
  },
];
const DEFAULT_TOKEN_MAINNET_LIST: TokenInfo[] = [
  {
    id: "token.sweat",
    name: "SWEAT",
    symbol: "SWEAT",
    decimals: 18,
    icon: "/img/tokens/sweat.svg",
  },
  {
    id: "aaaaaa20d9e0e2461697782ef11675f668207961.factory.bridge.near",
    name: "Aurora",
    symbol: "AURORA",
    decimals: 18,
    icon: "/img/tokens/aurora.svg",
  },
  {
    id: "usn",
    name: "USN",
    symbol: "USN",
    decimals: 18,
    icon: "/img/tokens/usn.svg",
  },
  {
    id: "token.0xshitzu.near",
    name: "SHITZU",
    symbol: "SHITZU",
    decimals: 18,
    icon: "/img/tokens/SHITZU.webp",
  },
  {
    id: "token.v1.realisnetwork.near",
    name: "Realis",
    symbol: "LIS",
    decimals: 12,
    icon: "/img/tokens/realis.svg",
  },
  {
    id: "linear-protocol.near",
    name: "LiNEAR",
    symbol: "LINEAR",
    decimals: 24,
    icon: "/img/tokens/linear.svg",
  },
  {
    id: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
    name: "Bridged USDC",
    symbol: "USDC.e",
    decimals: 6,
    icon: "/img/tokens/usdce.svg",
  },
  {
    id: "usdt.tether-token.near",
    name: "Tether USD",
    symbol: "USDt",
    decimals: 6,
    icon: "/img/tokens/usdt.svg",
  },
  WRAP_NEAR,
  {
    id: "shit.0xshitzu.near",
    name: "Shitzu Validator Reward",
    symbol: "DOGSHIT",
    icon: "/img/tokens/dogshit.webp",
    decimals: 24,
  },
  {
    id: "token.v2.ref-finance.near",
    name: "Ref Finance Token",
    symbol: "REF",
    decimals: 18,
    icon: "/img/tokens/ref.svg",
  },
  {
    id: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
    name: "Tether USD",
    symbol: "USDT.e",
    decimals: 6,
    icon: "/img/tokens/usdt.svg",
  },
  {
    id: "meta-pool.near",
    name: "Staked NEAR",
    symbol: "STNEAR",
    decimals: 24,
    icon: "/img/tokens/stnear.svg",
  },
  {
    id: "aurora",
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    icon: "/img/tokens/eth.png",
  },
  {
    id: "f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near",
    name: "Octopus Network Token",
    symbol: "OCT",
    decimals: 18,
    icon: "/img/tokens/oct.svg",
  },
  {
    id: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    icon: "/img/tokens/dai.svg",
  },
  {
    id: "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
    name: "Wrapped BTC",
    symbol: "WBTC",
    decimals: 8,
    icon: "/img/tokens/wbtc.svg",
  },
  {
    id: "meta-token.near",
    name: "Meta Token",
    symbol: "$META",
    decimals: 24,
    icon: "/img/tokens/meta.svg",
  },
  {
    id: "1ab43204a195a0fd37edec621482afd3792ef90b.factory.bridge.near",
    name: "Aurigami Token",
    symbol: "PLY",
    decimals: 18,
    icon: "/img/tokens/ply.svg",
  },
  {
    id: "52a047ee205701895ee06a375492490ec9c597ce.factory.bridge.near",
    name: "Pulse",
    symbol: "PULSE",
    decimals: 18,
    icon: "/img/tokens/pulse.svg",
  },
  {
    id: "token.pembrock.near",
    name: "PembRock",
    symbol: "PEM",
    decimals: 18,
    icon: "/img/tokens/pem.svg",
  },
  {
    id: "token.stlb.near",
    name: "SeatlabNFT",
    symbol: "SEAT",
    decimals: 5,
    icon: "/img/tokens/seat.svg",
  },
  {
    id: "token.burrow.near",
    name: "Burrow Token",
    symbol: "BRRR",
    decimals: 18,
    icon: "/img/tokens/brr.png",
  },
  {
    id: "4691937a7508860f876c9c0a2a617e7d9e945d4b.factory.bridge.near",
    name: "Wootrade Network",
    symbol: "WOO",
    decimals: 18,
    icon: "/img/tokens/woo.svg",
  },
  {
    id: "d9c2d319cd7e6177336b0a9c93c21cb48d84fb54.factory.bridge.near",
    name: "HAPI",
    symbol: "HAPI",
    decimals: 18,
    icon: "/img/tokens/hapi.svg",
  },
  {
    id: "token.paras.near",
    name: "PARAS",
    symbol: "PARAS",
    decimals: 18,
    icon: "/img/tokens/paras.png",
  },
  {
    id: "token.skyward.near",
    name: "Skyward Finance Token",
    symbol: "SKYWARD",
    decimals: 18,
    icon: "/img/tokens/skyward.png",
  },
  {
    id: "3ea8ea4237344c9931214796d9417af1a1180770.factory.bridge.near",
    name: "Flux Token",
    symbol: "FLX",
    decimals: 18,
    icon: "/img/tokens/flx.svg",
  },
  {
    id: "e99de844ef3ef72806cf006224ef3b813e82662f.factory.bridge.near",
    name: "YouMinter",
    symbol: "UMINT",
    decimals: 18,
    icon: "/img/tokens/umint.svg",
  },
  {
    id: "ftv2.nekotoken.near",
    name: "NEKO",
    symbol: "NEKO",
    decimals: 24,
    icon: "/img/tokens/neko.svg",
  },
  {
    id: "nearnvidia.near",
    name: "NearVidia",
    symbol: "NEARVIDIA",
    decimals: 8,
    icon: "/img/tokens/nearvidia.png",
  },
  {
    id: "blackdragon.tkn.near",
    name: "Black Dragon",
    symbol: "BLACKDRAGON",
    decimals: 24,
    icon: "/img/tokens/blackdragon.jpg",
  },
  {
    id: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    icon: "/img/tokens/usdc.svg",
  },
  {
    id: "853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near",
    name: "Frax",
    symbol: "FRAX",
    decimals: 18,
    icon: "/img/tokens/frax.svg",
  },
  {
    id: "ea7cc765ebc94c4805e3bff28d7e4ae48d06468a.factory.bridge.near",
    name: "NearPad Token",
    symbol: "PAD",
    decimals: 18,
    icon: "/img/tokens/pad.svg",
  },
];

export const DEFAULT_TOKENS_LIST = IS_MAINNET
  ? DEFAULT_TOKEN_MAINNET_LIST
  : DEFAULT_TOKEN_TESTNET_LIST;

export const DEFAULT_TOKEN_LIST_MAP = DEFAULT_TOKENS_LIST.reduce(
  (acc, token) => {
    acc[token.id] = token;
    return acc;
  },
  {} as Record<string, TokenInfo>
);
