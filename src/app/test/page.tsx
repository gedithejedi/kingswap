"use client"
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { getStaticProvider, useEthersSigner } from "@/lib/wallet";
import { NumericFormat } from "react-number-format";
import { ChangeEvent, useState } from "react";
import { ethers, BigNumber } from "ethers";
import ERC20ABI from "@/lib/erc20Abi.json";

import dayjs from "dayjs";
import { approveSwapTransaction } from "../utils/fetchSwap";
import toast from "react-hot-toast";

const types = {
  Permit: [{
    name: "owner",
    type: "address"
  },
  {
    name: "spender",
    type: "address"
  },
  {
    name: "value",
    type: "uint256"
  },
  {
    name: "nonce",
    type: "uint256"
  },
  {
    name: "deadline",
    type: "uint256"
  },
  ],
};

export default function Test() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();

  const [amountToSwap, setAmountToSwap] = useState("0");

  const chainId = chain?.id || "";
  const receiver = "0x43a04F19Cc140102501AcC9da48BF85f9EE8829f";
  const tokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  const amount = ethers.utils.parseUnits("2", 6);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replaceAll(",", "");
    setAmountToSwap(num);
  };

  const createPermit = async () => {
    if (!address) return console.log("No address found.");
    if (!chainId) return console.log("error getting chainId");

    const provider = getStaticProvider(chainId);
    const token = new ethers.Contract(tokenAddress, ERC20ABI, provider)

    if (!token) return toast.error("soemthing went wrong fetching the token");

    const deadline = dayjs().add(86400, "seconds").unix();

    const nonces = await token.nonces(address);

    const domain = {
      name: await token.name(),
      version: "2",
      chainId,
      verifyingContract: token.address
    };

    const values = {
      owner: address,
      spender: receiver,
      value: amount,
      nonce: nonces,
      deadline,
    };

    if (!signer) return console.error("Error getting signer");
    console.log({ domain, types, values });
    try {
      const signature = await signer._signTypedData(domain, types, values);
      console.log(signature);
      // split the signature into its components
      const sig = ethers.utils.splitSignature(signature);
      console.log(sig)

      // const recovered = ethers.utils.verifyTypedData(
      //   domain,
      //   types,
      //   values,
      //   sig
      // );

      approveSwapTransaction(
        {
          owner: address,
          spender: receiver,
          value: amount,
          deadline: BigNumber.from(deadline),
          v: sig.v,
          r: sig.r,
          s: sig.s,
        },
        tokenAddress
      )

    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <main className="flex flex-col">
      <div className="w-full flex justify-end py-3 px-4">
        <div className="w-60">
          <DynamicWidget variant='modal' />
        </div>
      </div>

      <div className="flex flex-col items-center mt-10 gap-9">
        Testing the permits
        <NumericFormat
          thousandSeparator={","}
          allowNegative={false}
          className="text-black p-2 h-10 w-64 flex justify-between"
          name={"amount"}
          // label={"Amount to swap"}
          placeholder={"0.00"}
          onChange={handleChange}
          value={amountToSwap}
        // error={error}
        // disabled={disabled}
        />
        <button
          disabled={!address}
          className="bg-blue-400 hover:bg-blue-500 py-2 px-8 rounded"
          onClick={() => createPermit()}
        >
          Create and execute the permit
        </button>
        <button
          disabled={!address}
          className="bg-blue-400 hover:bg-blue-500 py-2 px-8 rounded"
          onClick={() => console.log("backend")}
        >
          Call backend
        </button>
      </div>
    </main >
  );
}
