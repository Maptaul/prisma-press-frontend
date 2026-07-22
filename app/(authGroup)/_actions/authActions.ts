"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
};

export const loginAction = async (
  prevState: LoginState | null,
  formData: FormData,
) => {
  console.log("loginAction called with formData:", formData);
  console.log(prevState, "prev state");

  const email = formData.get("email");
  const password = formData.get("password");
  const payload = { email, password };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.data?.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
    });
    cookieStore.set("refreshToken", result.data?.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    });

    const decodedToken = jwt.decode(result.data?.accessToken) as JwtPayload;
    if (decodedToken.role === "USER") {
      redirect("/dashboard");
    } else if (decodedToken.role === "ADMIN") {
      redirect("/admin-dashboard");
    } else if (decodedToken.role === "AUTHOR") {
      redirect("/author-dashboard");
    }
  }

  return result;
};

type RegisterState = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
};

export const registerAction = async (
  prevState: RegisterState | null,
  formData: FormData,
) => {
  console.log("registerAction called with formData:", formData);
  console.log(prevState, "prev state");

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const profilePhoto = formData.get("profilePhoto");
  const payload = { name, email, password, profilePhoto };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  const result = await res.json();
  if (result.success) {
    redirect("/login");
  }
  return result;
};
