export type NewsSearchParams = {
  [key: string]: string | string[] | undefined;
};

export type SortOrder = "asc" | "desc";

export type NewsFilters = {
  searchTerm: string;
  tags: string[];
  status: string;
  isFeatured: boolean;
  sortBy: string;
  sortOrder: SortOrder;
  page: number;
  limit: number;
};

export type NewsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const POST_STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "views:desc", label: "Most viewed" },
  { value: "title:asc", label: "Title A–Z" },
  { value: "title:desc", label: "Title Z–A" },
] as const;

export const PAGE_SIZE_OPTIONS = [9, 18, 30] as const;

export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_ORDER: SortOrder = "desc";
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 9;

const MAX_LIMIT = 60;
const MAX_PAGE = 10_000;

// The API builds `orderBy: { [sortBy]: sortOrder }` without validating the
// field, so an unknown key would reach Prisma and fail. Only ship fields we
// expose in the UI.
const SORTABLE_FIELDS = new Set<string>(
  SORT_OPTIONS.map((option) => option.value.split(":")[0]),
);

const VALID_STATUSES = new Set<string>(
  POST_STATUS_OPTIONS.map((option) => option.value),
);

// Exact-match filters the API supports but the UI does not surface yet; they
// are forwarded untouched so deep links keep working.
const PASSTHROUGH_PARAMS = ["title", "content", "authorId"] as const;

function readParam(search: NewsSearchParams | undefined, key: string): string {
  const value = search?.[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

/**
 * Reads `tags` from the URL, accepting both repeated params (`?tags=a&tags=b`)
 * and comma-separated values (`?tags=a,b`).
 */
export function readTags(search?: NewsSearchParams): string[] {
  const raw = search?.tags;
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const tags = values
    .flatMap((value) => value.split(","))
    .map((tag) => tag.trim())
    .filter(Boolean);

  return Array.from(new Set(tags));
}

/**
 * Converts a `URLSearchParams` into the shape `parseNewsFilters` expects.
 * `Object.fromEntries` cannot be used here: it would keep only the last value
 * of repeated params such as `?tags=a&tags=b`.
 */
export function toNewsSearchParams(params: URLSearchParams): NewsSearchParams {
  const record: NewsSearchParams = {};

  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    record[key] = values.length > 1 ? values : values[0];
  }

  return record;
}

function toBoundedInt(value: string, fallback: number, max: number): number {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

/**
 * Normalises raw URL search params into the filter state both the server
 * actions and the filter UI read from, so they can never disagree.
 */
export function parseNewsFilters(search?: NewsSearchParams): NewsFilters {
  const sortBy = readParam(search, "sortBy");
  const sortOrder = readParam(search, "sortOrder");
  const status = readParam(search, "status").toUpperCase();

  return {
    searchTerm: readParam(search, "searchTerm").trim(),
    tags: readTags(search),
    status: VALID_STATUSES.has(status) ? status : "",
    isFeatured: readParam(search, "isFeatured") === "true",
    sortBy: SORTABLE_FIELDS.has(sortBy) ? sortBy : DEFAULT_SORT_BY,
    sortOrder: sortOrder === "asc" ? "asc" : DEFAULT_SORT_ORDER,
    page: toBoundedInt(readParam(search, "page"), DEFAULT_PAGE, MAX_PAGE),
    limit: toBoundedInt(readParam(search, "limit"), DEFAULT_LIMIT, MAX_LIMIT),
  };
}

/** True when the user narrowed the list beyond sorting and paging. */
export function hasActiveNewsFilters(filters: NewsFilters): boolean {
  return Boolean(
    filters.searchTerm ||
      filters.status ||
      filters.isFeatured ||
      filters.tags.length > 0,
  );
}

/** `null` or `""` removes the param; an array writes one entry per value. */
export type NewsParamUpdates = Record<string, string | string[] | null>;

type BuildHrefOptions = {
  /**
   * Any filter or sort change invalidates the current page number, so it is
   * dropped by default. Pass `false` when the update *is* the page change.
   */
  resetPage?: boolean;
};

/**
 * Applies param updates on top of the URL that is already in the address bar,
 * so search, filters, sorting and paging never clobber each other's state.
 */
export function buildNewsHref(
  pathname: string,
  currentParams: URLSearchParams,
  updates: NewsParamUpdates,
  { resetPage = true }: BuildHrefOptions = {},
): string {
  const params = new URLSearchParams(currentParams.toString());

  for (const [key, value] of Object.entries(updates)) {
    params.delete(key);

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry) {
          params.append(key, entry);
        }
      }
    } else if (value) {
      params.set(key, value);
    }
  }

  if (resetPage && !("page" in updates)) {
    params.delete("page");
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

/**
 * Builds the backend query string from a page's searchParams, forwarding only
 * params the API understands so unrelated URL state never reaches it.
 */
export function buildNewsQuery(search?: NewsSearchParams): string {
  const filters = parseNewsFilters(search);
  const params = new URLSearchParams();

  if (filters.searchTerm) {
    params.set("searchTerm", filters.searchTerm);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  // The API evaluates `Boolean(query.isFeatured)`, so even the string "false"
  // would read as true — send the param only when we want featured posts.
  if (filters.isFeatured) {
    params.set("isFeatured", "true");
  }

  // The API runs `JSON.parse(query.tags)`, so it must receive a JSON array.
  if (filters.tags.length > 0) {
    params.set("tags", JSON.stringify(filters.tags));
  }

  for (const key of PASSTHROUGH_PARAMS) {
    const value = readParam(search, key);

    if (value) {
      params.set(key, value);
    }
  }

  params.set("sortBy", filters.sortBy);
  params.set("sortOrder", filters.sortOrder);
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  return params.toString();
}
