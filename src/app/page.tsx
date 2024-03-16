"use client"
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import type { TokenConfig } from "@/helpers/types";
import { getChainOrDefaultChain, isSupportedChain } from '@/helpers/network'
import { Londrina_Solid } from 'next/font/google'
import { getBalance } from "@/lib/wallet";

import Image from "next/image";
import TokenSelectPopup from "./components/TokenSelectPopup";
import Button from "./components/Button";
import PriceInput from "./components/PriceInput";

const londrina = Londrina_Solid({ 
  weight: ["300", "400"],
  subsets: ['latin']
})

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
  const chainId = chain?.id;
  const currentChainOrDefaultChain = useMemo(() => getChainOrDefaultChain(chainId), [chainId]);
  const isChainSupported = useMemo(() => isSupportedChain(chainId), [chainId]);
  const isButtonDisabled = !isChainSupported || amountToSwap === undefined;

  const userBalance = useRef<number>(0);
  useEffect(() => {
    async function checkBalance() {
      if(!address || !tokenToSwapFrom || !chainId) {
        userBalance.current = 0;
        return;
      };

      userBalance.current = Number(await getBalance(address, tokenToSwapFrom, chainId));
      return ;
    }
    checkBalance();
  }, [tokenToSwapFrom, amountToSwap, address]);

  const doesUserHaveEnoughBalance = useMemo(() => {
    if(!tokenToSwapFrom || !amountToSwap) return true;
    return userBalance.current >= parseFloat(amountToSwap.replace(/,/g, ''));
  },[userBalance, amountToSwap, tokenToSwapFrom]);
  
  const permitToken = async () => {
    if(!isChainSupported) {
      console.error("Chain not supported")
      return
    }
    
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
        chainId={currentChainOrDefaultChain}
        isOpen={!!tokenPopupPayload} 
        close={() => setTokenPopupPayload(undefined)}
      />}

      <div className="w-full flex justify-end py-3 px-4">
        <div className="w-60">
          <DynamicWidget variant='modal' />
        </div>
      </div>

      <div>
        <h1 className={`text-5xl tracking-wider font-bold text-center uppercase ${londrina.className}`}>Kingswap</h1>
      </div>

      <div className="flex flex-col items-center mt-10 gap-9">
        <div className="flex flex-col gap-y-5 items-center md:w-[80%] max-w-[600px]">
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full">
              <Image src="/star.png" alt="star" width={70} height={100} className="absolute top-[-94px] left-4 z-0" />
              <Image src="/star.png" alt="star" width={40} height={50} className="absolute top-[-54px] right-4 z-0" />
              <PriceInput
                chain={currentChainOrDefaultChain}
                amountToSwap={amountToSwap}
                setAmountToSwap={setAmountToSwap}
                selectedToken={tokenToSwapFrom}
                setTokenPopupPayload={setTokenPopupPayload}
                disabledTokens={tokenToSwapTo ? [tokenToSwapTo] : []}
                setSelectedToken={setTokenToSwapFrom}
                disabled={!isChainSupported}
               />
              <div className="absolute bottom-[-16px] w-full flex items-center justify-center">
                <div
                  className={`bg-gray-light border-bg-gray w-10 h-10 border-4 rounded-lg flex items-center justify-center ${isChainSupported ? "cursor-pointer hover:bg-primary": "cursor-not-allowed"}`}
                  onClick={() => {
                    const temp = tokenToSwapFrom;
                    setTokenToSwapFrom(tokenToSwapTo);
                    setTokenToSwapTo(temp);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                  </svg>
                </div>
              </div>
            </div>
            <PriceInput
              chain={currentChainOrDefaultChain}
              isNumberInputDisabled={true}
              amountToSwap={amountToSwap}
              setAmountToSwap={setAmountToSwap}
              selectedToken={tokenToSwapTo}
              setTokenPopupPayload={setTokenPopupPayload}
              disabledTokens={tokenToSwapFrom ? [tokenToSwapFrom] : []}
              setSelectedToken={setTokenToSwapTo}
              disabled={!isChainSupported}
            />
          </div>
          <Button 
            type="primary" 
            className="w-full text-lg py-3" 
            onClick={permitToken}
            disabled={isButtonDisabled || !doesUserHaveEnoughBalance}
          >
            {!isConnected ? 'Please connect wallet': isButtonDisabled ? "Permit" : `Permit ${amountToSwap} ${tokenToSwapFrom?.symbol ?? 'ETH'}`}
          </Button>
          {!doesUserHaveEnoughBalance && <p className="text-red-400 text-start w-full">
            It looks like you don&apos;t have enough balance to swap {amountToSwap} {tokenToSwapFrom?.symbol ?? 'ETH'}
          </p>}
        </div>
      </div>
    </main>
  );
}
