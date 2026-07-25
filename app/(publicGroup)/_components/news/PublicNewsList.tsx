/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewsCard } from "@/app/(publicGroup)/_components/news/NewsCard";
import { IPost } from "@/lib/types";

export async function PublicNewsList() {

  const result = {
    success: true,
    data: [
      {
        id: "1",
        title: "Public News 1",
        content: "This is the content of public news 1.",
        thumbnail: "https://via.placeholder.com/150",
        isFeatured: true,
        status: "PUBLISHED",
        tags: ["tag1", "tag2"],
        views: 100,
        isPremium: false,
        authorId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  };

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No news found.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((post : IPost | any) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
      
    </div>
  );
}
