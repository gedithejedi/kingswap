import { Chains } from "./network";

export const contractsByChain: Record<Chains, Record<string, `0x${string}`>> = {
  [Chains.SEPOLIA]: {
    kingSwap: "0x569fef97e7dadfdd3d29513d01da7d0807feb109",
    poolManager: "0xa78C4E832067D08e028CF25De0368B54bEc05C12",
  },
  [Chains.BASE_SEPOLIA]: {
    kingSwap: "0xDfa46254e8543e094Fb3911D261cb824453b3f14",
    poolManager: "0x02A861ce06Da648cd270808F17E71949B6b79cf5",
  },
  [Chains.ARBITRUM_SEPOLIA]: {
    kingSwap: "0x8B8fC6d345Ef56fbeF941DDA3794FcBF207169d2",
    poolManager: "0x3E81bDA1E894cE5b0e1C1b40CaB7b2f311Cb3131",
  },
};
