export const coingeckoSymbolMap = {
  NEAR: "near",
  REF: "ref-finance",
  USDt: "tether",
  "USDT.e": "tether",
  "USDC.e": "bridged-usdc",
  "b-USDt": "tether",
  USDCe: "bridged-usdc",
  FRAX: "frax",
  UMINT: "",
  wNEAR: "wrapped-near",
  PEM: "pembrock",
  BRRR: "burrow",
  HAPI: "hapi",
  NEARVIDIA: "",
  LIS: "realis-network",
  WBTC: "wrapped-bitcoin",
  DAI: "dai",
  SWEAT: "sweat-economy",
  PULSE: "pulse-token",
  PLY: "aurigami",
  BLACKDRAGON: "black-dragon",
  OCT: "octopus-network",
  LINEAR: "linear-protocol-staked-near",
  AURORA: "aurora-near",
  SKYWARD: "",
  FLX: "flux-token",
  SEAT: "seatlabnft",
  WOO: "woo",
  $META: "",
  USN: "",
  USDC: "bridged-usdc",
  NEKO: "",
  PARAS: "paras",
  STNEAR: "staked-near",
  ETH: "ethereum",
};

type CoingeckoSymbol = keyof typeof coingeckoSymbolMap;

const getCoingeckoSymbol = (symbol: string) =>
  coingeckoSymbolMap[symbol as CoingeckoSymbol];

export default getCoingeckoSymbol;
