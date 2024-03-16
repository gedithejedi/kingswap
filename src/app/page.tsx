"use client"
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Dispatch, SetStateAction, useState } from "react";
import type { TokenConfig } from "@/helpers/types";

import TokenSelectPopup from "./components/TokenSelectPopup";
import Button from "./components/Button";
import PriceInput from "./components/PriceInput";

export default function Home() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const [tokenToSwapFrom, setTokenToSwapFrom] = useState<TokenConfig | undefined>(); 
  const [tokenToSwapTo, setTokenToSwapTo] = useState<TokenConfig | undefined>(); 
  const [amountToSwap, setAmountToSwap] = useState<string | undefined>(); 
  const [tokenPopupPayload, setTokenPopupPayload] = useState<{
    selectedToken?: TokenConfig,
    disabledTokens: TokenConfig[],
    onSelect: Dispatch<SetStateAction<undefined | TokenConfig>>,
  }>();

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
    <main className="flex flex-col min-h-screen bg-bg-gray text-white">
      {tokenPopupPayload && <TokenSelectPopup 
        {...tokenPopupPayload}
        isOpen={!!tokenPopupPayload} 
        close={() => setTokenPopupPayload(undefined)}
      />}
      <div className="w-full flex justify-end py-3 px-4">
        <div className="w-60">
          <DynamicWidget variant='modal' />
        </div>
      </div>

      <div className="flex flex-col items-center mt-10 gap-9">
        <div className="flex flex-col gap-y-5 items-center md:w-[80%] max-w-[600px]">
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full">
              <PriceInput
                amountToSwap={amountToSwap}
                setAmountToSwap={setAmountToSwap}
                selectedToken={tokenToSwapFrom}
                setTokenPopupPayload={setTokenPopupPayload}
                disabledTokens={tokenToSwapTo ? [tokenToSwapTo] : []}
                setSelectedToken={setTokenToSwapFrom}
               />
              <div className="absolute bottom-[-16px] w-full flex items-center justify-center">
                <div
                  className="bg-gray-light w-10 h-10 border-4 border-bg-gray rounded-lg flex items-center justify-center"
                  onClick={() => {
                    const temp = tokenToSwapFrom;
                    setTokenToSwapFrom(tokenToSwapTo);
                    setTokenToSwapTo(temp);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                  </svg>
                </div>
              </div>
            </div>
            <PriceInput
              isNumberInputDisabled={true}
              amountToSwap={amountToSwap}
              setAmountToSwap={setAmountToSwap}
              selectedToken={tokenToSwapTo}
              setTokenPopupPayload={setTokenPopupPayload}
              disabledTokens={tokenToSwapFrom ? [tokenToSwapFrom] : []}
              setSelectedToken={setTokenToSwapTo}
            />
          </div>
          <Button type="primary" className="w-full text-lg py-3" onClick={permitToken} >
            Permit 5 USDC
          </Button>
        </div>
      </div>
    </main>
  );
}
