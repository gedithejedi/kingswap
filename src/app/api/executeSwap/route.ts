import type { NextApiRequest, NextApiResponse } from "next";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chainId, permitParams, tokenAddress } = req.body;

  if (!chainId || !permitParams || !tokenAddress) {
    throw new Error("You need to provide a valid request body");
  }

  if (req.method !== "GET") {
    throw new ReferenceError("Method not allowed");
  }

  try {


    return res.status(200).json({ status: "all is gucci" });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
}
