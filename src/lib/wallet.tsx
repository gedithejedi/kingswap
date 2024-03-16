import { providers, utils } from "ethers";
import { useMemo } from "react";
import { HttpTransport } from "viem";
import { type PublicClient, usePublicClient, WalletClient, useWalletClient } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { readContract } from '@wagmi/core'
import { parseAbi } from 'viem'
import { TokenConfig } from "@/helpers/types";

export const getStaticProvider = (chainId: number) => {
  const client = getPublicClient({ chainId });
  return publicClientToProvider(client);
};

// Signer
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient]);
}

// Provider
export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  if (transport.type === "fallback") {
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  }
  return new providers.JsonRpcProvider(transport.url, network);
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return useMemo(() => publicClientToProvider(publicClient), [publicClient]);
}

export async function getBalance(address: `0x${string}`, token: TokenConfig, chainId: number) {
  if(token.isNative) {
    const provider = getStaticProvider(chainId);
    return utils.formatEther(await provider.getBalance(address));
  }

  return readContract({ 
    address: token.address,
    abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
    functionName: 'balanceOf',
    args: [address],
  })
}