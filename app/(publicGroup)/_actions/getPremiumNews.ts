"use server";

import { buildNewsQuery, NewsSearchParams } from "@/lib/newsQuery";
import { cookies } from "next/headers";

export const getPremiumNews = async ({
  search,
}: {
  search?: NewsSearchParams;
} = {}) => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  if (!accessToken) {
    return {
      success: false,
      message: "user not logged in",
    };
  }

  const query = buildNewsQuery(search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/premium${query ? `?${query}` : ""}`,
    {
      headers: {
        cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    },
  );
  const result = await res.json();
  return result;
};
