"use client";
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useEthersSigner } from "@/lib/wallet";
import { NumericFormat } from "react-number-format";
import { ChangeEvent, useState } from "react";
import { ethers } from "ethers";
import { PermitData, usePostPermit } from "../utils/postPermit";
import toast from "react-hot-toast";

export default function Test() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();
  const { mutate: postPermit, isLoading } = usePostPermit();

  const [amountToSwap, setAmountToSwap] = useState("0");
  const chainId = chain?.id || "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replaceAll(",", "");
    setAmountToSwap(num);
  };

  const createPermit = async () => {
    if (!address) return toast.error("No address found.");
    if (!chainId) return toast.error("error getting chainId");
    if (!signer) return toast.error("error getting signers");

    const receiver = "0x43a04F19Cc140102501AcC9da48BF85f9EE8829f";
    const tokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
    const amount = ethers.utils.parseUnits("2", 6);

    const body: PermitData = {
      chainId,
      tokenAddress,
      userAddress: address,
      signer,
      recipient: receiver,
      amount,
    };

    postPermit(body, {
      async onSuccess() {
        toast.success("Permit created");
      },
      onError() {
        toast.error("Error creating permit", { id: "create-permit-error" });
      },
    });
  };

  return (
    <main className="flex flex-col">
      <div className="w-full flex justify-end py-3 px-4">
        <div className="w-60">
          <DynamicWidget variant="modal" />
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
    </main>
  );
}
