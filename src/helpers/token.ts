import {Chains} from "./network";
import {TokenConfig} from "./types";

export const tokensByChain: Record<Chains, TokenConfig[]> = {
    [Chains.SEPOLIA]: [
    ],
    [Chains.BASE_SEPOLIA]: [
        {title: 'Ethereum', symbol: 'ETH', imgUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'},
        {title: 'USDCoin', symbol: 'USDC', imgUrl: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png'},
    ],
    [Chains.ARBITRUM_SEPOLIA]: [
        {title: 'Ethereum', symbol: 'ETH', imgUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'},
        {title: 'USDCoin', symbol: 'USDC', imgUrl: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png'},
    ],
}
