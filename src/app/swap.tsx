"use client"

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const cssOverrides = `
  .popper-content__transform-origin-top-left {
    z-index: 10;
  }
`

const swap = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_PUBLIC_API_KEY || "",
        walletConnectors: [EthereumWalletConnectors],
        cssOverrides
      }}
    >
      <DynamicWagmiConnector>
        {children}
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  )
}

export default swap