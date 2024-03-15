"use client"
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export default function Home() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();

  // const { address } = useAccount()
  // console.log(address);
  const permitToken = async () => {
    console.log("click");
    // if (!address) return console.log("No address found.");

    // const walletClient = getWalletClient(chainId.toString())
    // const signature = await walletClient.signMessage({
    //   address,
    //   message: 'hello world',
    // })
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
          className="bg-blue-400 hover:bg-blue-500 py-2 px-8 rounded"
          onClick={() => permitToken()}
        >
          Permit 5 USDC
        </button>
      </div>
    </main>
  );
}
