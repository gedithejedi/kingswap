"use client"
import { useAccount, useNetwork } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import type { TokenConfig } from "@/helpers/types";
import { getChainOrDefaultChain, isSupportedChain } from '@/helpers/network'
import { Londrina_Solid } from 'next/font/google'

import Image from "next/image";
import TokenSelectPopup from "./components/TokenSelectPopup";
import Button from "./components/Button";
import Swap from "./components/Swap";
import Transfer from "./components/Transfer";

const londrina = Londrina_Solid({ 
  weight: ["300", "400"],
  subsets: ['latin']
})

export default function Home() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const [tokenPopupPayload, setTokenPopupPayload] = useState<{
    selectedToken?: TokenConfig,
    disabledTokens: TokenConfig[],
    onSelect: Dispatch<SetStateAction<undefined | TokenConfig>>,
  }>();
  const [selectedMenu, setSelectedMenu] = useState<string>('swap'); 
  const chainId = chain?.id;
  const currentChainOrDefaultChain = useMemo(() => getChainOrDefaultChain(chainId), [chainId]);
  const isChainSupported = useMemo(() => isSupportedChain(chainId), [chainId]);
  
  const permitToken = async () => {
    if(!isChainSupported) {
      console.error("Chain not supported")
      return
    }
    
    console.log("click");

  }

  return (
    <main className="min-w-screen min-h-screen bg-bg-gray text-white">
      {tokenPopupPayload && <TokenSelectPopup 
        {...tokenPopupPayload}
        chainId={currentChainOrDefaultChain}
        isOpen={!!tokenPopupPayload} 
        close={() => setTokenPopupPayload(undefined)}
      />}

      <div className="w-full h-screen relative flex flex-col items-center">
        <div className="w-full flex justify-end py-3 px-4">
          <div className="w-60">
            <DynamicWidget variant='modal' />
          </div>
        </div>

        <div>
          <h1 className={`text-5xl tracking-wider font-bold text-center uppercase ${londrina.className}`}>Kingswap</h1>
        </div>

        <div className="md:w-[80%] max-w-[600px]">
          <div className="relative flex flex-col items-center mt-10 gap-9 rounded-xl py-4 px-2 border-2">
            <Image src="/star.png" alt="star" width={70} height={100} className="absolute top-[-96px] left-4 z-0" />
            <Image src="/star.png" alt="star" width={40} height={50} className="absolute top-[-56px] right-4 z-0" />

            <div className="flex w-[150px] justify-between gap-x-2">
              <Button 
                onClick={() => setSelectedMenu('swap')} 
                disabled={selectedMenu === 'swap'}
                className={`px-4 ${selectedMenu === 'swap' ? 'bg-primary font-bold' : ''}`}
              >
                Swap
              </Button>
              <Button 
                onClick={() => setSelectedMenu('transfer')}  
                disabled={selectedMenu === 'transfer'}
                className={`px-4 ${selectedMenu === 'transfer' ? 'bg-primary font-bold' : ''}`}
              >
                Transfer
              </Button>
            </div>

            {selectedMenu === 'swap' && 
              <Swap 
                isChainSupported={isChainSupported} 
                currentChainOrDefaultChain={currentChainOrDefaultChain}
                address={address}
                chainId={chainId} 
                permitToken={permitToken}
              />
            }

            {selectedMenu === 'transfer' && 
              <Transfer
                isChainSupported={isChainSupported}
                address={address}
                currentChainOrDefaultChain={currentChainOrDefaultChain}
                permitToken={permitToken}
              />
            }
            
          </div>
        </div>
        <Image src="/king.png" alt="king" width={150} height={200} className="absolute bottom-0 left-24" />
        <Image src="/cat.png" alt="cat" width={150} height={200} className="absolute bottom-0 right-24" />
      </div>
    </main>
  );
}
