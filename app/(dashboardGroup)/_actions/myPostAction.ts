/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { isAccessTokeExists } from "@/service/refreshToken";
import { revalidateTag } from "next/cache";

export type PostState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Record<string, any>;
};
export const createPost = async (prevState: PostState, formData: FormData) => {
  const payload = {
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "),
    isPremium: formData.get("isPremium") === "on",
  };

  const accessToken = await isAccessTokeExists();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      cookie: `accessToken=${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
    if (result.data?.isPremium) {
      revalidateTag("premium-posts", {
        expire: 0,
      });
    }
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};
export const updatePost = async (
  postId: string,
  prevState: PostState,
  formData: FormData,
) => {
  console.log({
    postId,
  });
  const payload = {
    title: formData.get("title") ?? "",
    content: formData.get("content") ?? "",
    thumbnail: formData.get("thumbnail") ?? "",
    tags: (formData.get("tags") as string).split(", ") ?? "",
    isPremium: formData.get("isPremium") === "on",
  };

  const accessToken = await isAccessTokeExists();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        cookie: `accessToken=${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  const result = await res.json();
  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
    if (result.data?.isPremium) {
      revalidateTag("premium-posts", {
        expire: 0,
      });
    }
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- prevState is required positionally by useActionState
export const deletePost = async (postId: string, prevState: PostState) => {
  const accessToken = await isAccessTokeExists();
  if (!accessToken) {
    // throw new Error("Access token not found");
    return {
      success: false,
      message: "user not logged in",
    };
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
    {
      method: "DELETE",
      headers: {
        cookie: `accessToken=${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  const result = await res.json();
  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
    if (result.data?.isPremium) {
      revalidateTag("premium-posts", {
        expire: 0,
      });
    }
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};
export const getMyPosts = async () => {
  const accessToken = await isAccessTokeExists();
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
