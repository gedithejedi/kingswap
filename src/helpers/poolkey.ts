import { Chains } from "@/helpers/network";
import { contractsByChain } from "@/helpers/contract";

export const createPoolKey = async (
  currency0Addr: `0x${string}`,
  currency1Addr: `0x${string}`,
  chain: Chains
) => {
  // It should be address(currency0) < address(currency1)
  let currency0 = currency0Addr;
  let currency1 = currency1Addr;
  if (currency0 > currency1) {
    currency0 = currency1Addr;
    currency1 = currency0Addr;
  }

  const poolManager = contractsByChain[chain].poolManager;

  return {
    currency0,
    currency1,
    // TODO: add hooks address once we implement it
    hooks: "0x0",
    poolManager,
    fee: 0.003 * 1e18,
    // parameters,
    parameters: "0x0",
  };
};
