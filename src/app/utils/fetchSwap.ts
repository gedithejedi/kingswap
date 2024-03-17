import { BigNumber } from "ethers";

export interface Permit {
  owner: string;
  spender: string;
  value: BigNumber;
  deadline: BigNumber;
  v: number;
  r: string;
  s: string;
}

export const approveSwapTransaction = async (
  permit: Permit,
  tokenAddress: string,
  chainId: string
) => {
  const result = await fetch("/api/approveSwap", {
    method: "POST",
    body: JSON.stringify({ permit, tokenAddress, chainId }),
    headers: {
      "content-type": "application/json",
    },
  });

  const res = await result.json();

  const { success, message } = res;

  return { success, message };
};
