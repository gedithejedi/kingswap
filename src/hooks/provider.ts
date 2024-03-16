import { ethers } from "ethers";
import { Chains, chainRpcUrls } from "@/helpers/network";

const providers: Partial<
  Record<Chains, Promise<ethers.providers.JsonRpcProvider>>
> = {};

export const createProvider = async function (chain: Chains) {
  const rpcUrl = chainRpcUrls[chain];
  if (!rpcUrl) {
    throw new Error(`No rpcUrl for chain ${chain}`);
  }

  const provider = new ethers.providers.StaticJsonRpcProvider({ url: rpcUrl });
  await provider.ready;
  return provider;
};

export const setProvider = function (
  chain: Chains,
  provider: Promise<ethers.providers.JsonRpcProvider>
) {
  providers[chain] = provider;
};

const getProvider = function (
  chain: Chains
): Promise<ethers.providers.JsonRpcProvider> {
  let provider = providers[chain];
  if (!provider) {
    provider = createProvider(chain);
    setProvider(chain, provider);
  }
  return provider;
};

export default getProvider;
