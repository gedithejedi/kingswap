import type { NextApiRequest, NextApiResponse } from "next";
import { BigNumber } from "ethers";
import { NextResponse } from 'next/server';
import axios from 'axios';

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
  console.log("PING");
  const data = req.json();
  console.log(data);

  if (!data) {
    throw new Error("You need to provide a valid request body");
  }

  if (req.method !== "POST") {
    throw new ReferenceError("Method not allowed");
  }

  try {

    return NextResponse.json({ message: 'backend went weell' })

  } catch (error: any) {
    return NextResponse.json({ message: 'backend went not gucci' })
  }
}