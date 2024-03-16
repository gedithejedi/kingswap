export enum Chains {
    SEPOLIA = "11155111",
    BASE_SEPOLIA = "84532",
    ARBITRUM_SEPOLIA = "421614",
}

export const DEFAULT_CHAIN = Chains.BASE_SEPOLIA;

export const chainExplorerUrls: Record<Chains, string> = {
    [Chains.SEPOLIA]: "https://sepolia.etherscan.io/",
    [Chains.BASE_SEPOLIA]: "https://sepolia.base.org",
    [Chains.ARBITRUM_SEPOLIA]: "https://sepolia.arbiscan.io",
}

export const chainRpcUrls: Record<Chains, string> = {
    [Chains.SEPOLIA]: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY}`,
    [Chains.BASE_SEPOLIA]: "https://rpc.notadegen.com/base/sepolia",
    [Chains.ARBITRUM_SEPOLIA]: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
}

export const isSupportedChain = (chainId?: number) => {
    if(!chainId) return false;

    return Object.values(Chains).includes(String(chainId) as Chains);
} 

export const getChainOrDefaultChain = (chainId?: number): Chains => {
    if(isSupportedChain(chainId)) 
        return String(chainId) as Chains;

    return DEFAULT_CHAIN;
} 