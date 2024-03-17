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
      "function getSlot0(bytes32 id) view override returns (uint160 sqrtPriceX96, int24 tick, uint16 protocolFee, uint24 swapFee)",
    ],
    provider
  );

  const poolId = createPoolId(token0, token1, chain);
  const { sqrtPriceX96 } = await poolManager.getSlot0(poolId);

  const nativeToErc = (sqrtPriceX96 / 2 ** 96) ** 2;
  const ercToNative = 1 / nativeToErc;

  return {
    nativeToErc,
    ercToNative,
  };
}
