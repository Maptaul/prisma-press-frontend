"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildNewsHref,
  DEFAULT_LIMIT,
  hasActiveNewsFilters,
  NewsParamUpdates,
  PAGE_SIZE_OPTIONS,
  parseNewsFilters,
  POST_STATUS_OPTIONS,
  SORT_OPTIONS,
  toNewsSearchParams,
} from "@/lib/newsQuery";
import { TagIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type NewsFiltersProps = {
  /** Tags to offer in the dropdown, collected from the posts the API returned. */
  tagOptions: string[];
};

/** Radix Select rejects an empty string value, so "all" stands in for unset. */
const ALL_VALUE = "all";

export function NewsFilters({ tagOptions }: NewsFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useMemo(
    () =>
      parseNewsFilters(toNewsSearchParams(new URLSearchParams(searchParams))),
    [searchParams],
  );

  // A tag stays selectable even if it is missing from the current sample,
  // otherwise the user could not clear it from the dropdown.
  const tags = useMemo(
    () => Array.from(new Set([...tagOptions, ...filters.tags])).sort(),
    [tagOptions, filters.tags],
  );

  const updateParams = (updates: NewsParamUpdates) => {
    const href = buildNewsHref(
      pathname,
      new URLSearchParams(searchParams),
      updates,
    );

    router.replace(href, { scroll: false });
  };

  const toggleTag = (tag: string) => {
    const nextTags = filters.tags.includes(tag)
      ? filters.tags.filter((entry) => entry !== tag)
      : [...filters.tags, tag];

    updateParams({ tags: nextTags });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(":");
    updateParams({ sortBy, sortOrder });
  };

  const clearAll = () =>
    updateParams({
      searchTerm: null,
      status: null,
      isFeatured: null,
      tags: null,
    });

  const isFiltered = hasActiveNewsFilters(filters);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-37.5" aria-label="Sort news">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || ALL_VALUE}
          onValueChange={(value) =>
            updateParams({ status: value === ALL_VALUE ? null : value })
          }
        >
          <SelectTrigger className="w-35" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Any status</SelectItem>
            {POST_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.isFeatured ? "true" : ALL_VALUE}
          onValueChange={(value) =>
            updateParams({ isFeatured: value === ALL_VALUE ? null : "true" })
          }
        >
          <SelectTrigger className="w-35" aria-label="Filter by featured">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All stories</SelectItem>
            <SelectItem value="true">Featured only</SelectItem>
          </SelectContent>
        </Select>

        {tags.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <TagIcon data-icon="inline-start" />
                Tags
                {filters.tags.length > 0 && (
                  <Badge variant="secondary">{filters.tags.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-72 w-52 overflow-y-auto"
            >
              <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={filters.tags.includes(tag)}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Select
          value={String(filters.limit)}
          onValueChange={(value) =>
            updateParams({
              limit: Number(value) === DEFAULT_LIMIT ? null : value,
            })
          }
        >
          <SelectTrigger className="w-30" aria-label="Results per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button variant="ghost" onClick={clearAll}>
            <XIcon data-icon="inline-start" />
            Clear filters
          </Button>
        )}
      </div>

      {filters.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" asChild>
              <button type="button" onClick={() => toggleTag(tag)}>
                {tag}
                <XIcon data-icon="inline-end" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
