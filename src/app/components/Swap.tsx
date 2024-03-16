import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import type { TokenConfig } from "@/helpers/types";
import type { Chains } from "@/helpers/network";
import { getBalance } from "@/lib/wallet";

import Button from "../components/Button";
import PriceInput from "../components/PriceInput";
import TokenSelectPopup from "../components/TokenSelectPopup";

type SwapProps = {
    isChainSupported: boolean;
    currentChainOrDefaultChain: Chains;
    address?: `0x${string}`;
    chainId?: number;
    permitToken: () => void;
}

export default function Swap({
    isChainSupported,
    currentChainOrDefaultChain,
    address,
    chainId,
    permitToken,
}: SwapProps) {
    const [tokenToSwapFrom, setTokenToSwapFrom] = useState<TokenConfig | undefined>(); 
    const [tokenToSwapTo, setTokenToSwapTo] = useState<TokenConfig | undefined>(); 
    const [amountToSwap, setAmountToSwap] = useState<string | undefined>(); 
    const [tokenPopupPayload, setTokenPopupPayload] = useState<{
        selectedToken?: TokenConfig,
        disabledTokens: TokenConfig[],
        onSelect: Dispatch<SetStateAction<undefined | TokenConfig>>,
    }>();
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
    }, [chainId, tokenToSwapFrom, amountToSwap, address]);

    const doesUserHaveEnoughBalance = useMemo(() => {
        if(!tokenToSwapFrom || !amountToSwap) return true;
        return userBalance.current >= parseFloat(amountToSwap.replace(/,/g, ''));
    },[userBalance, amountToSwap, tokenToSwapFrom]);

    return (
        <div>
            {tokenPopupPayload && <TokenSelectPopup 
                {...tokenPopupPayload}
                chainId={currentChainOrDefaultChain}
                isOpen={!!tokenPopupPayload} 
                close={() => setTokenPopupPayload(undefined)}
            />}
            <div className="w-full flex flex-col gap-y-5 items-center">
                <div className="flex flex-col items-center w-full">
                    <div className="w-full relative">
                        <PriceInput
                            chain={currentChainOrDefaultChain}
                            amount={amountToSwap}
                            setAmount={setAmountToSwap}
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
                        amount={amountToSwap}
                        setAmount={setAmountToSwap}
                        selectedToken={tokenToSwapTo}
                        setTokenPopupPayload={setTokenPopupPayload}
                        disabledTokens={tokenToSwapFrom ? [tokenToSwapFrom] : []}
                        setSelectedToken={setTokenToSwapTo}
                        disabled={!isChainSupported}
                    />
                </div>
                <Button 
                    type="primary" 
                    className="w-full text-lg py-3 font-semibold" 
                    onClick={permitToken}
                    disabled={isButtonDisabled || !doesUserHaveEnoughBalance}
                >
                    {!address
                        ? 'Please connect wallet'
                            : isButtonDisabled 
                                ? "Permit" 
                                : `Permit ${amountToSwap} ${tokenToSwapFrom?.symbol ?? 'ETH'}`
                    }
                </Button>
                {!doesUserHaveEnoughBalance 
                    && <p className="text-red-400 text-start w-full">
                        It looks like you don&apos;t have enough balance to swap {amountToSwap} {tokenToSwapFrom?.symbol ?? 'ETH'}
                    </p>
                }
            </div>
        </div>
    )
}