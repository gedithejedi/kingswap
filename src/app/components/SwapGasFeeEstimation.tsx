import type { Chains } from "@/helpers/network";
import { contractsByChain } from "@/helpers/contract";
import { ethers, utils } from "ethers";
import kingSwapAbi from "@/lib/kingSwapAbi.json";
import { use, useEffect, useMemo, useRef } from "react";

type SwapGasFeeEstimationProps = {
  chain: Chains;
};

export default function SwapGasFeeEstimation({
  chain,
}: SwapGasFeeEstimationProps) {
  const kingswapAddress = contractsByChain[chain]["kingswap"];
  const provider = ethers.getDefaultProvider();
  const kingswap = useMemo(
    () =>
      kingswapAddress
        ? new ethers.Contract(kingswapAddress, kingSwapAbi, provider)
        : null,
    [kingswapAddress]
  );

  const gasFee = useRef("0");
  useEffect(() => {
    async function getGasFee() {
      if (!kingswap) {
        return;
      }
      // TODO: fill in the arguments for the swap function
      gasFee.current = utils.formatUnits(
        await kingswap.estimateGas.swap(),
        "ether"
      );
    }
    getGasFee();
  }, [kingswap]);

  return <p>{gasFee.current}</p>;
}
