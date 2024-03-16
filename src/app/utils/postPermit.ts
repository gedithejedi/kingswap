import ERC20ABI from "@/lib/erc20Abi.json";
import { ethers, BigNumber } from "ethers";

import dayjs from "dayjs";
import { approveSwapTransaction } from "../utils/fetchSwap";
import toast from "react-hot-toast";
import { types } from "../utils/permit";
import { useMutation } from "@tanstack/react-query";

export interface PermitData {
  chainId: number;
  tokenAddress: string;
  userAddress: string;
  signer: ethers.providers.JsonRpcSigner;
  provider: ethers.providers.JsonRpcProvider | ethers.providers.FallbackProvider;
  recipient: string;
  amount: BigNumber;
}

const postPermit = async (data: PermitData) => {
  try {
    const { tokenAddress, chainId, userAddress, signer, recipient, amount, provider } = data;
    const token = new ethers.Contract(tokenAddress, ERC20ABI, provider)

    if (!token) {
      toast.error("soemthing went wrong fetching the token");
      return;
    }

    const deadline = dayjs().add(86400, "seconds").unix();

    const nonces = await token.nonces(userAddress);

    const domain = {
      name: await token.name(),
      version: "2",
      chainId,
      verifyingContract: token.address,
    };

    const values = {
      owner: userAddress,
      spender: recipient,
      value: amount,
      nonce: nonces,
      deadline,
    };

    if (!signer) return console.error("Error getting signer");

    try {
      const signature = await signer._signTypedData(domain, types, values);
      const sig = ethers.utils.splitSignature(signature);

      approveSwapTransaction(
        {
          owner: userAddress,
          spender: recipient,
          value: amount,
          deadline: BigNumber.from(deadline),
          v: sig.v,
          r: sig.r,
          s: sig.s,
        },
        tokenAddress
      );
    } catch (error: any) {
      console.log(error);
    }

    return;
  } catch (error) {
    toast.error("Something went wrong initiating the swap.");
  }
};

export const usePostPermit = () => {
  return useMutation({
    mutationFn: (data: PermitData): Promise<void> => postPermit(data),
  });
};
