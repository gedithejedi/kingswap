/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react";
import Button from "../components/Button";
import type { TokenConfig } from "@/helpers/types";

type PriceInputProps = {
    isNumberInputDisabled?: boolean,
    amountToSwap?: string,
    setAmountToSwap: (value: string) => void,
    selectedToken?: TokenConfig,
    setTokenPopupPayload: (payload: {
        selectedToken?: TokenConfig,
        disabledTokens: TokenConfig[],
        onSelect: Dispatch<SetStateAction<undefined | TokenConfig>>,
    }) => void,
    disabledTokens: TokenConfig[],
    setSelectedToken: Dispatch<SetStateAction<undefined | TokenConfig>>,
}

export default function PriceInput({
    isNumberInputDisabled,
    amountToSwap,
    setAmountToSwap,
    selectedToken,
    setTokenPopupPayload,
    disabledTokens,
    setSelectedToken,
}: PriceInputProps) {
    return (
        <div className="flex gap-2 items-center bg-gray-light p-4 w-full rounded-lg mb-1">
            <input 
                className="bg-gray-light w-full focus:outline-none text-3xl p-2" 
                placeholder="0" 
                type="number"
                min={0}
                step={0.01}
                value={amountToSwap} 
                onChange={e => setAmountToSwap(e.target?.value)} 
                disabled={isNumberInputDisabled}
            />
            <Button
                className="flex justify-center items-center rounded-3xl text-base px-4 min-w-32 h-12 bg-gray-dark" 
                onClick={() => setTokenPopupPayload({
                selectedToken,
                disabledTokens,
                onSelect: setSelectedToken,
                })}
                >
                {selectedToken ? 
                    (
                        <div className="flex gap-x-1 items-center justify-between w-full">
                            {selectedToken.imgUrl &&
                            <img 
                                src={selectedToken.imgUrl} 
                                alt={selectedToken.title} 
                                className="w-8 h-8 rounded-full"
                                width={32}
                            /> 
                            }
                            <p>{selectedToken.symbol}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    ) : (<p>Select token</p>)
                }
            </Button>
        </div>
    )
}