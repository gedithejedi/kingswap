import { BigNumber } from "ethers";

export interface Permit {
  owner: string;
  spender: string;
  value: BigNumber;
  deadline: BigNumber;
  v: number;
  r: string;
  s: string;
}

// export const sendSwapTransaction = async (notificationPayload: {
//   accounts: string[];
//   notification: INotification;
// }) => {
//   const result = await fetch("/api/notify", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(notificationPayload),
//   });

//   const gmRes = await result.json();
//   const { success, message } = gmRes;

//   return { success, message };
// };

export const approveSwapTransaction = async (
  permit: Permit,
  tokenAddress: string
) => {
  const result = await fetch("/api/approveSwap", {
    method: "POST",
    body: JSON.stringify({ permit, tokenAddress }),
    headers: {
      "content-type": "application/json",
    },
  });

  const res = await result.json();

  const { success, message } = res;

  return { success, message };
};
