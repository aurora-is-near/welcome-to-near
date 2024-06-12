export const IS_MAINNET = process.env.nearEnv === "mainnet";

export const NEAR_CONNECTION_CONFIG = {
  networkId: process.env.nearEnv,
  nodeUrl: process.env.NEXT_PUBLIC_CUSTOM_NEAR_RPC || process.env.nearNativeRpc,
  explorerUrl: process.env.explorerUrl,
};
