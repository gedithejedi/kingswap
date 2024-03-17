import { Chains } from "./network";

export const contractsByChain: Record<Chains, Record<string, `0x${string}`>> = {
  [Chains.SEPOLIA]: {
    kingSwap: "0x569fef97e7dadfdd3d29513d01da7d0807feb109",
    poolManager: "0xa78C4E832067D08e028CF25De0368B54bEc05C12",
  },
  [Chains.BASE_SEPOLIA]: {},
  [Chains.ARBITRUM_SEPOLIA]: {},
};
