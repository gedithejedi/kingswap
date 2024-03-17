import { BigNumber } from "ethers";
import { NextResponse } from 'next/server';
import KingSwapAbi from "@/lib/kingSwapAbi.json";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chains, chainIdToViem, chainRpcUrls } from "@/helpers/network";
import { tokensByChain } from "@/helpers/token";
import { createPoolKey } from "@/helpers/poolkey";

export interface Permit {
  owner: string;
  spender: string;
  value: BigNumber
  deadline: BigNumber;
  v: BigNumber;
  r: string;
  s: string;
}

const privateKey = process.env.PROXY_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("You need to provide PROXY_PRIVATE_KEY env variable");
}

export async function POST(req: Request) {
  const { permit, tokenAddress, chainId } = await req.json();
  const { owner, spender, value, deadline, v, r, s } = permit;

  const rpcUrl = chainRpcUrls[chainId as Chains];
  const viemChain = chainIdToViem[chainId as Chains]

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(rpcUrl)
  })

  if (req.method !== "POST") {
    throw new ReferenceError("Method not allowed");
  }

  if (!permit) {
    throw new Error("You need to provide a valid request body");
  }

  try {
    const account = privateKeyToAccount(privateKey as any);

    const client = createWalletClient({
      account,
      chain: viemChain,
      transport: http()
    })

    const swapToCurrency = tokensByChain[chainId as Chains][0]?.address;
    const poolKey = createPoolKey(
      tokenAddress,
      swapToCurrency,
      chainId
    );

    let amountToReceive = BigNumber.from(value.hex).mul(BigNumber.from(95)).div(100);

    const { request } = await publicClient.simulateContract({
      account,
      address: spender,
      abi: KingSwapAbi,
      functionName: 'swapSingle',
      args: [
        [
          Object.values(poolKey),
          false,
          owner,
          BigNumber.from(value.hex),// amountIn,
          amountToReceive, // amountOutMinimum, .3%
          0, // sqrtPriceLimitX96,
          "0x0000000000000000000000000000000000000000"// hookData,
        ],
        owner,
        BigNumber.from(value.hex),
        BigNumber.from(deadline.hex),
        v,
        r,
        s
      ],
    })

    await client.writeContract(request)

    return NextResponse.json({ message: 'backend went well' })
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'backend went not gucci' })
  }
}