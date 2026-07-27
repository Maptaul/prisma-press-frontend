export type NewsSearchParams = {
  [key: string]: string | string[] | undefined;
};

// Query params accepted by both GET /api/posts and GET /api/premium.
const FORWARDED_PARAMS = [
  "searchTerm",
  "title",
  "content",
  "authorId",
  "isFeatured",
  "tags",
  "status",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
] as const;

/**
 * Builds the backend query string from a page's searchParams, forwarding only
 * params the API understands so unrelated URL state never reaches it.
 */
export function buildNewsQuery(search?: NewsSearchParams): string {
  const params = new URLSearchParams();

  for (const key of FORWARDED_PARAMS) {
    const value = search?.[key];

    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  }

  return params.toString();
}
