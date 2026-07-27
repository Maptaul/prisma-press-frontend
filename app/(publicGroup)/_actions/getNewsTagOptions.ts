"use server";

import { IPost } from "@/lib/types";
import { cookies } from "next/headers";

export type NewsScope = "public" | "premium";

// The API has no dedicated tags endpoint, so options are collected from a
// sample of recent posts. Tags outside that sample stay reachable via the URL.
const TAG_SAMPLE_SIZE = 100;
const TAG_CACHE_SECONDS = 60;

function collectTags(posts: IPost[]): string[] {
  const tags = posts.flatMap((post) => post.tags ?? []).filter(Boolean);

  return Array.from(new Set(tags)).sort();
}

export const getNewsTagOptions = async (
  scope: NewsScope = "public",
): Promise<string[]> => {
  const query = `page=1&limit=${TAG_SAMPLE_SIZE}&sortBy=createdAt&sortOrder=desc`;

  try {
    if (scope === "premium") {
      const cookiesStore = await cookies();
      const accessToken = cookiesStore.get("accessToken")?.value;

      if (!accessToken) {
        return [];
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/premium?${query}`,
        {
          headers: { cookie: `accessToken=${accessToken}` },
          cache: "no-store",
        },
      );
      const result = await res.json();

      // /api/premium returns { data: [...] }
      return result.success ? collectTags(result.data ?? []) : [];
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?${query}`,
      { next: { revalidate: TAG_CACHE_SECONDS } },
    );
    const result = await res.json();

    // /api/posts nests the list one level deeper: { data: { data: [...] } }
    return result.success ? collectTags(result.data?.data ?? []) : [];
  } catch {
    // Tag options are an enhancement — the rest of the filters still work.
    return [];
  }
};
