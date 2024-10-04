import { keccak256, toHex } from "viem";
import { watchAsset, switchChain } from "viem/actions";
import { getConnectorClient } from "@wagmi/core";
import { wagmiConfig } from "@/contexts/WalletSelectorContext";
import { getTokenMetaData } from "@/utils/near";

export async function addTokenToWallet(
  contractId: string,
  symbol: string,
  decimals: number
) {
  try {
    let image = "";
    const tokenMetadataRequest = await getTokenMetaData(contractId);
    if (tokenMetadataRequest !== null) {
      image = tokenMetadataRequest.icon;
    }

    const walletClient = await getConnectorClient(wagmiConfig);
    await switchChain(walletClient,{ id: Number(process.env.chainId)}) 
    const address = playgroundComputeAddress(contractId);

    watchAsset(walletClient, {
      type: "ERC20",
      options: {
        address: address,
        symbol: symbol,
        decimals: decimals,
        image,
      },
    });
  } catch (e) {
    console.error(e);
  }
}

function playgroundComputeAddress(input: string) {
  const hash = keccak256(toHex(input));
  return "0x" + hash.substring(26, 66);
}
