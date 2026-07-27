import { NewsCard } from "@/app/(publicGroup)/_components/news/NewsCard";
import {
  hasActiveNewsFilters,
  NewsMeta,
  NewsSearchParams,
  parseNewsFilters,
} from "@/lib/newsQuery";
import { IPost } from "@/lib/types";
import { getPublicNews } from "../../_actions/getPublicNews";
import { NewsPagination } from "./NewsPagination";

export async function PublicNewsList({
  searchParams,
}: {
  searchParams?: Promise<NewsSearchParams>;
}) {
  const search = await searchParams;
  const result = await getPublicNews({ search });

  if (!result.success || !result.data?.length) {
    const isFiltered = hasActiveNewsFilters(parseNewsFilters(search));

    return (
      <p className="py-12 text-center text-muted-foreground">
        {isFiltered
          ? "No news matched your filters."
          : "No news found."}
      </p>
    );
  }

  const meta: NewsMeta | undefined = result.meta;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((post: IPost) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>

      {meta && <NewsPagination meta={meta} />}
    </div>
  );
}
