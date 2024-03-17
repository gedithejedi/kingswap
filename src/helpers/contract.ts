import { Chains } from "./network";

export const contractsByChain: Record<Chains, Record<string, `0x${string}`>> = {
  [Chains.SEPOLIA]: {
    kingSwap: "0x569fef97e7dadfdd3d29513d01da7d0807feb109",
    poolManager: "0xa78C4E832067D08e028CF25De0368B54bEc05C12",
  },
  [Chains.BASE_SEPOLIA]: {
    kingSwap: "0xe440196150B4F5B9B8009093bE161BA2C5480932",
    poolManager: "0xC7364B0cA4EE9EF4aBcc2Da2e24e07C8cf453C44",
  },
  [Chains.ARBITRUM_SEPOLIA]: {
    kingSwap: "0xe8Ff2ade7A2FBCDF022946896f3DCbe5cacd6934",
  },
};
