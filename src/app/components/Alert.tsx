import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import Button from "./Button";

type AlertProps = {
  title: string;
  description: React.ReactNode;
  isOpen: boolean;
  close: () => void;
};

export default function Alert({
  title,
  description,
  isOpen,
  close,
}: AlertProps) {
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
                    <h2 className="text-lg font-semibold">{title}</h2>
                  </div>

                  <div className="w-full flex flex-col gap-y-2">
                    {description}
                    <div>
                      <Button onClick={close}>Close</Button>
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
