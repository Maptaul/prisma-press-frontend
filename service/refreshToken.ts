"use server";

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookiesStore = await cookies();
  const refreshToken = cookiesStore.get("refreshToken")?.value;
  if (!refreshToken) {
    // throw new Error("Refresh token not found");
    return {
      success: false,
      message: "Refresh token not found",
    };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,

    {
      method: "POST",
      headers: {
        cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-cache",
    },
  );
  const result = await res.json();
  return result;
};
