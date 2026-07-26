"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const subscribePremium = async () => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  if (!accessToken) {
    // throw new Error("Access token not found");
    return {
      success: false,
      message: "user not logged in",
    };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/checkout`,
    {
      method: "POST",
      headers: {
        cookie: `accessToken=${accessToken}`,
      },
    },
  );
  const result = await res.json();
  if (result.success && result.data?.paymentUrl) {
    redirect(result.data.paymentUrl);
  }
  return result;
};
