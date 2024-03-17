import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { TokenConfig } from "@/helpers/types";
import { Chains } from "@/helpers/network";
import { getBalance } from "@/lib/wallet";
import { tokensByChain } from "@/helpers/token";
import { getPriceForSwap } from "@/helpers/priceOracle";
import Decimal from "decimal.js";

import Button from "../components/Button";
import PriceInput from "../components/PriceInput";
import TokenSelectPopup from "../components/TokenSelectPopup";

type SwapProps = {
  isChainSupported: boolean;
  currentChainOrDefaultChain: Chains;
  address?: `0x${string}`;
  chainId?: number;
  permitToken: (amount: string, tokenAddress: string) => void;
  isLoading?: boolean;
};

export default function Swap({
  isChainSupported,
  currentChainOrDefaultChain,
  address,
  chainId,
  isLoading,
  permitToken,
}: SwapProps) {
  const [tokenToSwapFrom, setTokenToSwapFrom] = useState<
    TokenConfig | undefined | null
  >();
  const [tokenToSwapTo, setTokenToSwapTo] = useState<
    TokenConfig | undefined | null
  >();
  const [amountToSwap, setAmountToSwap] = useState<string | undefined>();
  const [amountToReceive, setAmountToReceive] = useState<string | undefined>();
  const [tokenPopupPayload, setTokenPopupPayload] = useState<{
    selectedToken?: TokenConfig | null;
    disabledTokens: TokenConfig[];
    onSelect: Dispatch<SetStateAction<undefined | TokenConfig | null>>;
  }>();
  const isButtonDisabled = !isChainSupported || amountToSwap === undefined;

  const userBalance = useRef<number>(0);
  useEffect(() => {
    async function checkBalance() {
      if (
        !address ||
        !tokenToSwapFrom ||
        !chainId ||
        tokenToSwapFrom.chainId !== chainId
      ) {
        userBalance.current = 0;
        return;
      }

      userBalance.current = Number(
        await getBalance(address, tokenToSwapFrom, chainId)
      );
      return;
    }
    checkBalance();
  }, [chainId, tokenToSwapFrom, amountToSwap, address]);

  const doesUserHaveEnoughBalance = useMemo(() => {
    if (!tokenToSwapFrom || !amountToSwap) return true;
    return userBalance.current >= parseFloat(amountToSwap.replace(/,/g, ""));
  }, [userBalance, amountToSwap, tokenToSwapFrom]);

  const nativeToken = useMemo(
    () =>
      tokensByChain[currentChainOrDefaultChain].find((token) => token.isNative),
    [currentChainOrDefaultChain]
  );

  const swapPrices = useRef<
    { nativeToErc: number; ercToNative: number } | undefined | null
  >();

  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  useEffect(() => {
    if (!tokenToSwapFrom || !tokenToSwapTo) {
      swapPrices.current = null;
      return;
    }

    setIsFetchingPrice(true);
    getPriceForSwap(
      tokenToSwapFrom.address,
      tokenToSwapTo.address,
      currentChainOrDefaultChain
    ).then((prices) => {
      swapPrices.current = prices;
      setIsFetchingPrice(false);
    });
  }, [tokenToSwapFrom, tokenToSwapTo, currentChainOrDefaultChain]);

  useEffect(() => {
    if (nativeToken) {
      setTokenToSwapTo(nativeToken);
    }
    if (tokenToSwapFrom) {
      setTokenToSwapFrom(null);
    }
  }, [chainId, nativeToken]);

  const [shouldShowToken0First, setShouldShowToken0First] =
    useState<boolean>(true);

  useEffect(() => {
    if (
      !tokenToSwapFrom ||
      !tokenToSwapTo ||
      !amountToSwap ||
      amountToSwap === "" ||
      !swapPrices.current
    ) {
      setAmountToReceive("");
      return;
    }

    const swapAmount = new Decimal(
      parseFloat(amountToSwap?.replace(/,/g, "") ?? "0")
    );
    const ercToNative = new Decimal(swapPrices.current?.ercToNative ?? 0);
    const amount = swapAmount.times(ercToNative);

    setAmountToReceive(amount.toLocaleString());
  }, [
    tokenToSwapFrom,
    tokenToSwapTo,
    amountToSwap,
    swapPrices,
    isFetchingPrice,
  ]);

  return (
    <div className="w-full">
      {tokenPopupPayload && (
        <TokenSelectPopup
          {...tokenPopupPayload}
          chainId={currentChainOrDefaultChain}
          isOpen={!!tokenPopupPayload}
          close={() => setTokenPopupPayload(undefined)}
        />
      )}
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
              <div className="bg-gray-light border-bg-gray w-10 h-10 border-4 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                  />
                </svg>
              </div>
            </div>
          </div>
          <PriceInput
            isLoading={isFetchingPrice}
            chain={currentChainOrDefaultChain}
            isNumberInputDisabled={true}
            amount={amountToReceive}
            setAmount={setAmountToReceive}
            selectedToken={tokenToSwapTo}
            setTokenPopupPayload={setTokenPopupPayload}
            disabledTokens={tokenToSwapFrom ? [tokenToSwapFrom] : []}
            setSelectedToken={setTokenToSwapTo}
            disabled={true}
          />
        </div>
        <Button
          isLoading={isLoading}
          type="primary"
          className="w-full text-lg py-3 font-semibold"
          onClick={() =>
            permitToken(amountToSwap || "0", tokenToSwapFrom?.address || "")
          }
          disabled={
            isButtonDisabled || !doesUserHaveEnoughBalance || isFetchingPrice
          }
        >
          {!address
            ? "Please connect wallet"
            : isButtonDisabled
              ? "Swap"
              : `Swap ${amountToSwap} ${tokenToSwapFrom?.symbol ?? "ETH"}`}
        </Button>
        {(swapPrices.current || isFetchingPrice) && (
          <div className="w-full flex justify-between">
            <span className="text-primary text-sm">Price</span>
            {swapPrices.current ? (
              <div className="w-2/3 flex gap-2 justify-end items-center text-sm">
                <span>1</span>
                <span>
                  {shouldShowToken0First
                    ? tokenToSwapFrom?.symbol
                    : tokenToSwapTo?.symbol}
                </span>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShouldShowToken0First(!shouldShowToken0First);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                    />
                  </svg>
                </div>
                <span>
                  {shouldShowToken0First
                    ? swapPrices.current.ercToNative.toString()
                    : swapPrices.current.nativeToErc.toString()}
                </span>
                <span>
                  {shouldShowToken0First
                    ? tokenToSwapTo?.symbol
                    : tokenToSwapFrom?.symbol}
                </span>
              </div>
            ) : (
              isFetchingPrice && <div>Loading price...</div>
            )}
          </div>
        )}
        {!doesUserHaveEnoughBalance && (
          <p className="text-red-400 text-start w-full">
            It looks like you don&apos;t have enough balance to swap{" "}
            {amountToSwap} {tokenToSwapFrom?.symbol ?? "ETH"}
          </p>
        )}
      </div>
    </div>
  );
}
