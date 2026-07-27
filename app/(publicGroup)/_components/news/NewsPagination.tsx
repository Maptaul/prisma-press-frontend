"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildNewsHref, NewsMeta } from "@/lib/newsQuery";
import { usePathname, useSearchParams } from "next/navigation";

type NewsPaginationProps = {
  meta: NewsMeta;
};

/** Pages rendered on each side of the current page before collapsing. */
const SIBLING_COUNT = 1;

type PageItem = number | "start-ellipsis" | "end-ellipsis";

function getPageItems(current: number, totalPages: number): PageItem[] {
  // First page, last page, the current page and its siblings, plus the two
  // ellipsis slots — below that everything fits without collapsing.
  const maxVisible = SIBLING_COUNT * 2 + 5;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const firstSibling = Math.max(current - SIBLING_COUNT, 2);
  const lastSibling = Math.min(current + SIBLING_COUNT, totalPages - 1);

  const items: PageItem[] = [1];

  if (firstSibling > 2) {
    items.push("start-ellipsis");
  }

  for (let page = firstSibling; page <= lastSibling; page++) {
    items.push(page);
  }

  if (lastSibling < totalPages - 1) {
    items.push("end-ellipsis");
  }

  items.push(totalPages);

  return items;
}

export function NewsPagination({ meta }: NewsPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(meta.totalPages, 1);
  const currentPage = Math.min(Math.max(meta.page, 1), totalPages);

  const firstItem = meta.total === 0 ? 0 : (currentPage - 1) * meta.limit + 1;
  const lastItem = Math.min(currentPage * meta.limit, meta.total);

  // Page 1 is the default, so it stays out of the URL entirely. Clamping keeps
  // the disabled prev/next arrows pointing at a real page instead of 0 or n+1.
  const hrefForPage = (page: number) => {
    const target = Math.min(Math.max(page, 1), totalPages);

    return buildNewsHref(
      pathname,
      new URLSearchParams(searchParams),
      { page: target === 1 ? null : String(target) },
      { resetPage: false },
    );
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex flex-col items-center gap-3 border-t pt-6 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{firstItem}</span>
        {"–"}
        <span className="font-medium text-foreground">{lastItem}</span> of{" "}
        <span className="font-medium text-foreground">{meta.total}</span>{" "}
        {meta.total === 1 ? "story" : "stories"}
      </p>

      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={hrefForPage(currentPage - 1)}
                aria-disabled={isFirstPage}
                tabIndex={isFirstPage ? -1 : undefined}
                scroll={false}
              />
            </PaginationItem>

            {getPageItems(currentPage, totalPages).map((item) =>
              typeof item === "number" ? (
                <PaginationItem key={item}>
                  <PaginationLink
                    href={hrefForPage(item)}
                    isActive={item === currentPage}
                    scroll={false}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href={hrefForPage(currentPage + 1)}
                aria-disabled={isLastPage}
                tabIndex={isLastPage ? -1 : undefined}
                scroll={false}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
