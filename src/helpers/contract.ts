import { Chains } from "./network";

export const contractsByChain: Record<Chains, Record<string, `0x${string}`>> = {
  [Chains.SEPOLIA]: {},
  [Chains.BASE_SEPOLIA]: {},
  [Chains.ARBITRUM_SEPOLIA]: {},
};
