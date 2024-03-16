export enum Chains {
    SEPOLIA = "11155111",
    BASE_SEPOLIA = "84532",
    ARBITRUM_SEPOLIA = "421614",
}

export const chainExplorerUrls: Record<Chains, string> = {
    [Chains.SEPOLIA]: "https://sepolia.etherscan.io/",
    [Chains.BASE_SEPOLIA]: "https://sepolia.base.org",
    [Chains.ARBITRUM_SEPOLIA]: "https://sepolia.arbiscan.io",
}

export const chainRpcUrls: Record<Chains, string> = {
    [Chains.SEPOLIA]: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY}`,
    [Chains.BASE_SEPOLIA]: "https://sepolia-explorer.base.org",
    [Chains.ARBITRUM_SEPOLIA]: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
}
