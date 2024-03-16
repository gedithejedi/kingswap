import { BigNumber } from "ethers";

export interface Permit {
  owner: string;
  spender: string;
  value: BigNumber
  deadline: BigNumber;
  v: Buffer;
  r: Buffer;
  s: Buffer;
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

export const approveSwapTransaction = async (permit: Permit) => {
  console.log(JSON.stringify(permit));

  const result = await fetch("/api/approveSwap", {
    method: 'POST',
    body: JSON.stringify({ permit }),
    headers: {
      'content-type': 'application/json'
    }
  })

  const res = await result.json();
  const { success, message } = res;

  return { success, message };
};