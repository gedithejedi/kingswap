# Kingswap

![kingswap start page](/document/start_page.png)

`Kingswap` helps user swap USDC tokens without the need of having any ETH in their wallet. We utilise ERC permits to achieve this. 
- [Frontend](https://github.com/gedithejedi/kingswap)
- [Foundry Smart Contracts](https://github.com/akerbabber/kingswap-contracts)

Live project can be checked on [kingswap-alpha.vercel.app](https://kingswap-alpha.vercel.app/)

## Getting Started (locally)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables
- `NEXT_PUBLIC_DYNAMIC_PUBLIC_API_KEY` 
- `PROXY_PRIVATE_KEY` 
- `ALCHEMY_API`
