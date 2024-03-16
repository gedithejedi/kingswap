"use client"
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useSignTypedData } from 'wagmi'
import { useEthersSigner } from "@/lib/wallet";

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
  const { signTypedData } = useSignTypedData()
  const signer = useEthersSigner();

  const chainId = chain?.id;
  const contractAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  const splitSig = (sig: any) => {
    // splits the signature to r, s, and v values.
    const pureSig = sig.replace("0x", "")

    const r = new Buffer(pureSig.substring(0, 64), 'hex')
    const s = new Buffer(pureSig.substring(64, 128), 'hex')
    const v = new Buffer((parseInt(pureSig.substring(128, 130), 16)).toString());


    return {
      r, s, v
    }
  }

  // const signTyped = async (dataToSign: string, domain: any, value: any) => {
  //   return new Promise((resolve, reject) => {
  //     const signer = new ethers.providers.JsonRpcProvider().getSigner();
  //     const signature = signer._signTypedData(domain, types, value);

  //     return { signer, signature }
  //   })
  // }

  const createPermit = async () => {
    if (!chainId) return console.log("error getting chainId");
    const domain = {
      name: "Kings Swap",
      version: '1',
      chainId,
      verifyingContract: contractAddress
    };

    const value = {
      from: {
        name: 'Cow',
        wallet: '0xB3622628546DE921A70945ffB51811725FbDA109'
      },
      to: {
        name: 'Bob',
        wallet: '0xa91d405230bd93d873c98c9ED96285775ec1dC1A'
      },
      contents: 'Hello, Bob!'
    };

    if (!signer) return console.error("Error getting signer");

    try {
      const signature = await signer._signTypedData(domain, types, value);
      console.log(signature);
      const split = splitSig(signature)

      return {
        ...split, signature
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const permitToken = async () => {
    console.log("permit");
    if (!address) return console.log("No address found.");
    console.log("hew");
    const permit = await createPermit();
    console.log(permit);

    //TODO: call the usdc contract to execute the transaction
    // console.log(`r: 0x${permit.r.toString('hex')}, s: 0x${permit.s.toString('hex')}, v: ${permit.v}, sig: ${permit.signature}`);
  }

  return (
    <main className="flex flex-col">
      <div className="w-full flex justify-end py-3 px-4">
        <div className="w-60">
          <DynamicWidget variant='modal' />
        </div>
      </div>

      <div className="flex flex-col items-center mt-10 gap-9">
        Approve a USDC token
        <button
          disabled={!address}
          className="bg-blue-400 hover:bg-blue-500 py-2 px-8 rounded"
          onClick={() => permitToken()}
        >
          Permit 5 USDC
        </button>
      </div>
    </main>
  );
}
