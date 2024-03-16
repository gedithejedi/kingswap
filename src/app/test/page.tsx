"use client"
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { getStaticProvider, useEthersSigner } from "@/lib/wallet";
import { NumericFormat } from "react-number-format";
import { ChangeEvent, useState } from "react";
import { Contract, BigNumber } from "ethers";

import ERC20ABI from "@/lib/erc20Abi.json";
import dayjs from "dayjs";
import { approveSwapTransaction } from "../utils/fetchSwap";

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' }
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' }
  ]
};

export default function Test() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();

  const [amountToSwap, setAmountToSwap] = useState("0");

  const chainId = chain?.id || "";
  const contractAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  const spender = '0x43a04F19Cc140102501AcC9da48BF85f9EE8829f';
  const amount = "1000000000000000000";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replaceAll(",", "");
    setAmountToSwap(num);
  };

  const splitSig = (sig: any) => {
    const pureSig = sig.replace("0x", "")

    const r = new Buffer(pureSig.substring(0, 64), 'hex')
    const s = new Buffer(pureSig.substring(64, 128), 'hex')
    const v = new Buffer((parseInt(pureSig.substring(128, 130), 16)).toString());

    return { r, s, v }
  }

  const createPermit = async () => {
    if (!address) return console.log("No address found.");
    if (!chainId) return console.log("error getting chainId");
    const domain = {
      name: "Kings Swap",
      version: '1',
      chainId,
      verifyingContract: contractAddress //transaction to
    };

    const deadline = dayjs().add(86400, "seconds").unix();

    const value = {
      from: {
        name: 'From',
        wallet: address // User wallet address
      },
      to: {
        name: 'To',
        wallet: spender // Uniswap contract?
      },
      contents: 'Send USDC from bank to secondary wallet',
      duration: deadline,
      value: amount,
    };

    if (!signer) return console.error("Error getting signer");

    try {
      const signature = await signer._signTypedData(domain, types, value);

      console.log(signature);
      const split = splitSig(signature)

      const permit = { ...split, signature }
      // console.log(`r: 0x${permit.r.toString('hex')}, s: 0x${permit.s.toString('hex')}, v: ${permit.v}, sig: ${permit.signature}`);
      console.log(permit);
      console.log("deadline", deadline);

      const provider = getStaticProvider(chainId);
      approveSwapTransaction({
        owner: address,
        spender,
        value: BigNumber.from(amount),
        deadline: BigNumber.from(deadline),
        v: permit.v,
        r: permit.r,
        s: permit.s,
      })
      const token = new Contract(address, ERC20ABI, provider);
      token.permit()
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
