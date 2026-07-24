import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getNewAccessToken } from "./service/refreshToken";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];
// const PUBLIC_ROUTES = ["/", "/news","/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news"];

// This function can be marked `async` if using `await` inside

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? await jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!)
    : null;

  const decodedRefreshToken = refreshToken
    ? await jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!)
    : null;
  // console.log("Access token expired, trying to refresh...");

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // console.log("Refreshing access token...");
    const result = await getNewAccessToken();
    // console.log(result);
    if (result.success) {
      const newAccessToken = result.data.accessToken;
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
      });

      accessToken = newAccessToken;
      decodedAccessToken = jwtUtils.verifyToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  let userRole = null;
  if (!decodedAccessToken?.success) {
    //token has expired or is invalid, redirect to login page
    cookieStore.delete("accessToken");
    // return NextResponse.redirect(new URL("/login", request.url));
  }
  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload)?.role;
  }

  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    // If the user is not authenticated and the route is an auth route, redirect to login
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL("/author-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  //authenticated user trying to access a public route or auth route, redirect to dashboard based on role
  if (!accessToken && !isPublic && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //authorized user trying to access a route that is not allowed for their role, redirect to home page
  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (
    pathname.startsWith("/author-dashboard") &&
    userRole !== "AUTHOR"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // return NextResponse.redirect(new URL("/", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/admin-dashboard/:path*",
    // "/author-dashboard/:path*",
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
