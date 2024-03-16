import { Dispatch, SetStateAction, useState } from "react";
import type { TokenConfig } from "@/helpers/types";
import type { Chains } from "@/helpers/network";

import PriceInput from "./PriceInput";
import TokenSelectPopup from "./TokenSelectPopup";
import Button from "./Button";

type TransferProps = {
  isChainSupported: boolean;
  currentChainOrDefaultChain: Chains;
  address?: `0x${string}`;
  permitToken: (amount: string, tokenAddress: string) => void;
  isLoading: boolean;
};

export default function Transfer({
  isChainSupported,
  currentChainOrDefaultChain,
  address,
  permitToken,
  isLoading,
}: TransferProps) {
  const [amount, setAmount] = useState<string | undefined>();
  const [receiver, setReceiver] = useState<string | undefined>();
  const [selectedToken, setSelectedToken] = useState<TokenConfig | undefined>();
  const [tokenPopupPayload, setTokenPopupPayload] = useState<{
    selectedToken?: TokenConfig;
    disabledTokens: TokenConfig[];
    onSelect: Dispatch<SetStateAction<undefined | TokenConfig>>;
  }>();
  const isButtonDisabled = !isChainSupported || amount === undefined;

  return (
    <div>
      {tokenPopupPayload && (
        <TokenSelectPopup
          {...tokenPopupPayload}
          chainId={currentChainOrDefaultChain}
          isOpen={!!tokenPopupPayload}
          close={() => setTokenPopupPayload(undefined)}
        />
      )}

      <div className="flex flex-col w-full">
        <PriceInput
          chain={currentChainOrDefaultChain}
          amount={amount}
          setAmount={setAmount}
          selectedToken={selectedToken}
          setTokenPopupPayload={setTokenPopupPayload}
          disabledTokens={[]}
          setSelectedToken={setSelectedToken}
          disabled={!isChainSupported}
          label="Amount to send"
        />
        <div className="bg-gray-light w-full p-4 px-5 rounded-lg">
          <label className="flex flex-col gap-y-3">
            <span className="text-sm font-semibold">Recipient</span>
            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="bg-gray-light w-full focus:outline-none text-xl "
              placeholder="0x23dfc90..."
            />
          </label>
        </div>

        <Button
          isLoading={isLoading}
          type="primary"
          className="w-full text-lg py-3 mt-5 font-semibold"
          onClick={() => permitToken(amount || "0", selectedToken?.address || "")}
          disabled={isButtonDisabled}
        >
          {!address
            ? "Please connect wallet"
            : isButtonDisabled
              ? "Permit"
              : `Permit ${amount} ${selectedToken?.symbol ?? "ETH"}`}
        </Button>
      </div>
    </div>
  );
}
