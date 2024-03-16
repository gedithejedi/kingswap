import { BigNumber } from "ethers";
import { NextResponse } from 'next/server';
import ERC20ABI from "@/lib/erc20Abi.json";
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

    console.log("private key");
    console.log(privateKey);
    console.log(account.publicKey);

    const client = createWalletClient({
      account,
      chain: sepolia,
      transport: http()
    })

    console.log({
      account,
      address: tokenAddress,
      functionName: 'permit',
      args: [owner, receiver, BigNumber.from(value.hex).toString(), BigNumber.from(deadline.hex).toString(), v, r, s],
    });

    const { request } = await publicClient.simulateContract({
      account,
      address: tokenAddress,
      abi: ERC20ABI,
      functionName: 'permit',
      args: [owner, receiver, BigNumber.from(value.hex), BigNumber.from(deadline.hex), v, r, s],
    })
    await client.writeContract(request)

    // const recovered = ethers.utils.verifyTypedData(
    //   domain,
    //   types,
    //   values,
    //   sig
    // );

    // gasPrice = await provider.getGasPrice()

    // let tx = await myToken.connect(tokenReceiver).permit(
    //   // tokenOwner.address,
    //   // tokenReceiver.address,
    //   value,
    //   deadline,
    //   sig.v,
    //   sig.r,
    //   sig.s, {
    //   gasPrice: gasPrice,
    //   gasLimit: 80000 //hardcoded gas limit; change if needed
    // }
    // );

    // await tx.wait(2)

    return NextResponse.json({ message: 'backend went well' })
  } catch (error: any) {
    console.error(error.shortMessage);
    return NextResponse.json({ message: 'backend went not gucci' })
  }
}