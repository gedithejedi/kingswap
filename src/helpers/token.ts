import {Chains} from "./network";
import {TokenConfig} from "./types";

export const tokensByChain: Record<Chains, TokenConfig[]> = {
    [Chains.SEPOLIA]: [
        {title: 'Ethereum', symbol: 'ETH', imgUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', isNative: true, address: '0x'},
        {title: 'USDCoin', symbol: 'USDC', imgUrl: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png', address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'},
    ],
    [Chains.BASE_SEPOLIA]: [
        {title: 'Ethereum', symbol: 'ETH', imgUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', isNative: true, address: '0x'},
        {title: 'USDCoin', symbol: 'USDC', imgUrl: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png', address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'},
    ],
    [Chains.ARBITRUM_SEPOLIA]: [
        {title: 'Ethereum', symbol: 'ETH', imgUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', isNative: true,  address: '0x'},
        {title: 'USDCoin', symbol: 'USDC', imgUrl: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png', address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'},
    ],
}
