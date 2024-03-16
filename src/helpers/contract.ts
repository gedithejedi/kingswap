import { Chains } from "./network";

export const contractsByChain: Record<Chains, Record<string, `0x${string}`>> = {
  [Chains.SEPOLIA]: {
    kingSwap: "0xd5793c7b114a67cbf0ccb4d81d321ab69b9a3949",
    poolManager: "0xad42935d193Af6a61bf6758CD81B637F787cf22d",
  },
  [Chains.BASE_SEPOLIA]: {},
  [Chains.ARBITRUM_SEPOLIA]: {},
};
