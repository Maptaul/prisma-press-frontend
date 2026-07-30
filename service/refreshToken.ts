"use server";

import { jwtUtils } from "@/utils/jwt";
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

export const isAccessTokeExists = async () => {
  const cookiesStore = await cookies();
  let accessToken = cookiesStore.get("accessToken")?.value;
  const refreshToken = cookiesStore.get("refreshToken")?.value;

  const decodedAccessToken = accessToken
    ? await jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!)
    : null;

  const decodedRefreshToken = refreshToken
    ? await jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!)
    : null;

  if (!accessToken && !refreshToken) {
    // throw new Error("Access token not found");
    return {
      success: false,
      message: "user not logged in",
    };
  }

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // console.log("Refreshing access token...");
    const result = await getNewAccessToken();
    // console.log(result);
    if (result.success) {
      const newAccessToken = result.data.accessToken;
      cookiesStore.set({
        name: "accessToken",
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
      });

      accessToken = newAccessToken;
    }
  }

  return accessToken
};
