"use server";

import { buildNewsQuery, NewsSearchParams } from "@/lib/newsQuery";

export const getPublicNews = async ({
  search,
}: {
  search?: NewsSearchParams;
} = {}) => {
  const query = buildNewsQuery(search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts${query ? `?${query}` : ""}`,
    {
      cache: "no-store",
    },
  );
  const result = await res.json();

  if (!result.success) {
    return result;
  }

  // /api/posts returns { data: { data, meta } } while /api/premium returns
  // { data, meta } — flatten so both actions expose the same shape.
  return {
    ...result,
    data: result.data?.data ?? [],
    meta: result.data?.meta,
  };
};
