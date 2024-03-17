import { Chains } from "@/helpers/network";
import { contractsByChain } from "@/helpers/contract";
import { utils } from "ethers";

export const createPoolKey = (
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
  const hooks = contractsByChain[chain].hooks;
  return {
    currency0,
    currency1,
    hooks,
    poolManager,
    fee: "3000",
    parameters:
      "0x00000000000000000000000000000000000000000000000000000000000100c0",
  };
};

export const createPoolId = (
  currency0Addr: `0x${string}`,
  currency1Addr: `0x${string}`,
  chain: Chains
) => {
  const abiCoder = new utils.AbiCoder();
  const poolKey = createPoolKey(currency0Addr, currency1Addr, chain);
  const id = utils.keccak256(
    abiCoder.encode(
      [
        "tuple(address currency0, address currency1, address hooks, address poolManager, uint24 fee, bytes32 parameters)",
      ],
      [poolKey]
    )
  );
  return id;
};
