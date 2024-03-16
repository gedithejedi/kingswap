import { BigNumber } from "ethers";
import { NextResponse } from 'next/server';
import ERC20ABI from "@/lib/erc20Abi.json";
import KingSwapAbi from "@/lib/kingSwapAbi.json";
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
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
const alchemyKey = process.env.ALCHEMY_API;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`)
})

if (!privateKey) {
  throw new Error("You need to provide PROXY_PRIVATE_KEY env variable");
}

export async function POST(req: Request) {
  const { permit, tokenAddress } = await req.json();
  const { owner, spender: receiver, value, deadline, v, r, s } = permit;

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
      chain: sepolia,
      transport: http()
    })

    const { request } = await publicClient.simulateContract({
      account,
      address: tokenAddress,
      abi: ERC20ABI,
      functionName: 'permit',
      args: [owner, receiver, BigNumber.from(value.hex), BigNumber.from(deadline.hex), v, r, s],
    })

    await client.writeContract(request)

    return NextResponse.json({ message: 'backend went well' })
  } catch (error: any) {
    console.error(error.shortMessage);
    return NextResponse.json({ message: 'backend went not gucci' })
  }
}