/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsCard } from "@/app/(publicGroup)/_components/news/NewsCard";
import { IPost } from "@/lib/types";

export async function PremiumNewsList() {
  const result = {
    success: true,
    data: [
      {
        id: "1",
        title: "Premium News 1",
        content: "This is a premium news article.",
        thumbnail: "/images/news1.jpg",
        isFeatured: true,
        status: "DRAFT",
        tags: ["tag", "tag2"],
        views: 100,
        isPremium: true,
        authorId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No premium news found.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((post: IPost | any) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
