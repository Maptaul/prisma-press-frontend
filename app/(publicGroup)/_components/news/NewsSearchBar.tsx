"use client";

import { Input } from "@/components/ui/input";
import { buildNewsHref } from "@/lib/newsQuery";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const DEBOUNCE_MS = 500;

export function NewsSearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const debouncedReference = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debouncedReference.current) {
        clearTimeout(debouncedReference.current);
      }
    };
  }, []);

  const handleChange = (value: string) => {
    if (debouncedReference.current) {
      clearTimeout(debouncedReference.current);
    }

    debouncedReference.current = setTimeout(() => {
      // buildNewsHref keeps the other filters intact and drops `page`, so a
      // new search always lands on the first page of results.
      const href = buildNewsHref(pathname, new URLSearchParams(searchParams), {
        searchTerm: value.trim() || null,
      });

      router.replace(href, { scroll: false });
    }, DEBOUNCE_MS);
  };

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        defaultValue={searchParams.get("searchTerm") ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search news..."
        className="pl-9"
      />
    </div>
  );
}
