import { keccak256, toHex } from "viem";
import { watchAsset, switchChain } from "viem/actions";
import { getConnectorClient } from "@wagmi/core";
import { wagmiConfig } from "@/contexts/WalletSelectorContext";
import { getTokenMetaData } from "@/utils/near";

export async function addTokenToWallet(contractId: string) {
  try {
    const tokenMetadataRequest = await getTokenMetaData(contractId);
    if (tokenMetadataRequest === null) {
      return;
    }

    const walletClient = await getConnectorClient(wagmiConfig);
    await switchChain(walletClient, { id: Number(process.env.chainId) });
    const address = playgroundComputeAddress(contractId);

    watchAsset(walletClient, {
      type: "ERC20",
      options: {
        address: address,
        symbol: tokenMetadataRequest.symbol,
        decimals: tokenMetadataRequest.decimals,
        image: tokenMetadataRequest.icon,
      },
    });
  } catch (e) {
    console.error(e);
  }
}

export function playgroundComputeAddress(input: string) {
  const hash = keccak256(toHex(input));
  return "0x" + hash.substring(26, 66);
}
