/* eslint-disable @next/next/no-img-element */
import type { TokenConfig } from "@/helpers/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { tokensByChain } from "@/helpers/token";
import { Chains } from "@/helpers/network";

import Button from "./Button";

type TokenSelectPopupProps = {
  chainId: Chains;
  selectedToken?: TokenConfig | null;
  disabledTokens: TokenConfig[];
  isOpen: boolean;
  onSelect: (token?: TokenConfig) => void;
  close: () => void;
};

export default function TokenSelectPopup({
  chainId,
  selectedToken,
  disabledTokens,
  isOpen,
  onSelect,
  close,
}: TokenSelectPopupProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" open={isOpen} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center">
          <div className="flex w-full h-full bg-bg-gray items-end justify-center text-center sm:w-[500px] sm:h-[600px] sm:items-center p-4 rounded">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="h-full w-full">
                <div className="flex w-full flex-col items-center gap-y-2 text-white">
                  <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg font-semibold">Select a token</h2>
                    <Button
                      className="text-lg font-semibold bg-transparent hover:bg-transparent"
                      onClick={close}
                    >
                      X
                    </Button>
                  </div>

                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-4 w-full overflow-y-scroll">
                      {tokensByChain[chainId].map((token) => {
                        const isDisabled = disabledTokens.some(
                          (disabledToken) =>
                            disabledToken.symbol === token.symbol
                        );
                        const isSelected = token.title === selectedToken?.title;

                        const bgColor = isSelected ? "bg-gray-darker" : "";
                        const textColor = isSelected
                          ? "text-primary"
                          : isDisabled
                            ? "text-gray-light"
                            : "text-white";
                        const corsor = isDisabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer";
                        const bgColorHover = isDisabled
                          ? ""
                          : "hover:bg-gray-darker";
                        return (
                          <div
                            className={`w-full flex items-center gap-4 text-start ${corsor} ${bgColor} ${textColor} ${bgColorHover} p-4 rounded-lg`}
                            key={token.title}
                            onClick={() => {
                              if (isDisabled) return;
                              onSelect(token);
                              close();
                            }}
                          >
                            {token.imgUrl && (
                              <img
                                className="w-9 h-9 rounded-full"
                                src={token.imgUrl}
                                alt={token.title}
                                width={36}
                                height={36}
                              />
                            )}
                            <div className="flex-1 flex flex-col gap-y-1 text-sm">
                              <p>{token.title}</p>
                              <p
                                className={`text-xs ${isDisabled ? textColor : "text-text-gray"}`}
                              >
                                {token.symbol}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
