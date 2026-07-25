/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPost } from "@/lib/types";
import { MyPostCard } from "./MyPostCard";

export async function MyPostsList() {
  const result = {
    success: true,
    data: [
      {
        id: "1",
        title: "My Post 1",
        content: "This is the content of my post 1.",
        thumbnail: "https://via.placeholder.com/150",
        isFeatured: true,
        status: "DRAFT",
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
        You haven&apos;t created any posts yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {result.data.map((post : IPost | any) => (
        <MyPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}