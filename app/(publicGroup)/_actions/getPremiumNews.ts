import { cookies } from "next/headers";

export const getPremiumNews = async () => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  if (!accessToken) {
    // throw new Error("Access token not found");
    return {
      success: false,
      message: "user not logged in",
    };
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/premium`, {
    headers: {
      cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });
  const result = await res.json();
  return result;
};
