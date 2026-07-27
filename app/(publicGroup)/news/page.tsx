import { NewsSearchParams } from "@/lib/newsQuery";
import { Suspense } from "react";
import { getNewsTagOptions } from "../_actions/getNewsTagOptions";
import { NewsFilters } from "../_components/news/NewsFilters";
import { NewsSearchBar } from "../_components/news/NewsSearchBar";
import { NewsSkeleton } from "../_components/news/NewsSkeleton";
import { PublicNewsList } from "../_components/news/PublicNewsList";

const NewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<NewsSearchParams>;
}) => {
  const tagOptions = await getNewsTagOptions("public");

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">News</h1>
          <p className="text-sm text-muted-foreground">
            Browse the latest published stories.
          </p>
        </div>
        <NewsSearchBar />
      </div>

      <NewsFilters tagOptions={tagOptions} />

      <Suspense fallback={<NewsSkeleton />}>
        <PublicNewsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default NewsPage;
