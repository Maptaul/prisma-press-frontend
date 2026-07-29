"use server";
import { cookies } from "next/headers";

export const createPost = async () =>{
  
}
export const getMyPosts = async () => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  if (!accessToken) {
    // throw new Error("Access token not found");
    return {
      success: false,
      message: "user not logged in",
    };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/my-posts`,
    {
      headers: {
        // Authorization: `Bearer ${accessToken}`,
        // Authorization: `${accessToken}`,
        // Authorization: accessToken as unknown as string,

        cookie: `accessToken=${accessToken}`,
      },
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24,
        tags: ["my-posts"],
      },
    },
  );
  const result = await res.json();
  console.log(result);
  return result;
};
