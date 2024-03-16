export enum Chains {
    BASE_SEPOLIA = "84532",
    ARBITRUM_SEPOLIA = "421614",
}

export const DEFAULT_CHAIN = Chains.BASE_SEPOLIA;

export const chainExplorerUrls: Record<Chains, string> =  {
    [Chains.BASE_SEPOLIA]: "https://sepolia.base.org",
    [Chains.ARBITRUM_SEPOLIA]: "https://sepolia.arbiscan.io",
}

export const chainRpcUrls: Record<Chains, string> = {
    [Chains.BASE_SEPOLIA]: "https://sepolia-explorer.base.org",
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