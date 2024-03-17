import { Chains } from "@/helpers/network";
import { contractsByChain } from "@/helpers/contract";
import { ethers } from "ethers";
import { createPoolId } from "@/helpers/poolkey";
import { getStaticProvider } from "@/lib/wallet";

export async function getPriceForSwap(
  token0: `0x${string}`,
  token1: `0x${string}`,
  chain: Chains
) {
  const poolManagerAddress = contractsByChain[chain].poolManager;
  const provider = getStaticProvider(Number(chain));
  const poolManager = new ethers.Contract(
    poolManagerAddress,
    [
      "function getSlot0(bytes32 id) view returns (uint160 sqrtPriceX96, int24 tick, uint16 protocolFee, uint24 swapFee)",
    ],
    provider
  );

  const poolId = createPoolId(token0, token1, chain);
  const { sqrtPriceX96 } = await poolManager.getSlot0(poolId);

  const price = (sqrtPriceX96 / 2 ** 96) ** 2;
  const nativeToErc = price / (10 ** 6 / 10 ** 18);
  const ercToNative = price / (10 ** 18 / 10 ** 6);

  return {
    nativeToErc,
    ercToNative,
  };
}
