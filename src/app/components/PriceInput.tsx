/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useMemo } from "react";
import type { TokenConfig } from "@/helpers/types";
import { Chains } from "@/helpers/network";

import { NumericFormat } from "react-number-format";
import Button from "../components/Button";
import { Spinner } from "./Spinner";

type PriceInputProps = {
  chain?: Chains;
  isNumberInputDisabled?: boolean;
  amount?: string;
  setAmount: (value: string) => void;
  selectedToken?: TokenConfig | null;
  setTokenPopupPayload: (payload: {
    selectedToken?: TokenConfig | null;
    disabledTokens: TokenConfig[];
    onSelect: Dispatch<SetStateAction<undefined | TokenConfig | null>>;
  }) => void;
  disabledTokens: TokenConfig[];
  setSelectedToken: Dispatch<SetStateAction<undefined | TokenConfig | null>>;
  disabled?: boolean;
  label?: string;
  isLoading?: boolean;
};

export default function PriceInput({
  isNumberInputDisabled,
  amount,
  setAmount,
  selectedToken,
  setTokenPopupPayload,
  disabledTokens,
  setSelectedToken,
  disabled,
  label,
  isLoading,
}: PriceInputProps) {
  const priceInUSDC = useMemo(() => {
    // TODO: add price calculation
    // if (!selectedToken || amount === undefined || amount === "") {
    return undefined;
    // }
    // return parseFloat(amount.replace(/,/g, ""));
  }, []);

  return (
    <div className="flex gap-2 items-center bg-gray-light p-4 w-full rounded-lg mb-1">
      <div className="w-full flex flex-col gap-y-1">
        <label className="flex flex-col gap-y-1">
          {label && <span className="ml-2 text-sm font-semibold">{label}</span>}
          <div className="w-full flex gap-2 items-center">
            {isLoading && <Spinner />}
            <NumericFormat
              thousandSeparator={","}
              allowNegative={false}
              className="bg-gray-light w-full focus:outline-none text-xl p-2"
              placeholder={"0.00"}
              onChange={(e) => setAmount(e.target?.value)}
              value={amount}
              disabled={isNumberInputDisabled || disabled}
              step={0.01}
            />
          </div>
        </label>
        {priceInUSDC !== undefined && (
          <p className="text-sm">$ {priceInUSDC}</p>
        )}
      </div>
      <Button
        className="flex justify-center items-center rounded-2xl text-base px-4 min-w-32 h-12 bg-gray-dark"
        onClick={() =>
          setTokenPopupPayload({
            selectedToken,
            disabledTokens,
            onSelect: setSelectedToken,
          })
        }
        disabled={disabled}
      >
        {selectedToken ? (
          <div className="flex gap-x-1 items-center justify-between w-full">
            {selectedToken.imgUrl && (
              <img
                src={selectedToken.imgUrl}
                alt={selectedToken.title}
                className="w-8 h-8 rounded-full"
                width={32}
              />
            )}
            <p>{selectedToken.symbol}</p>
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
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        ) : (
          <p>Select token</p>
        )}
      </Button>
    </div>
  );
}
