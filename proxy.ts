import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];
// const PUBLIC_ROUTES = ["/", "/news","/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news"];

// This function can be marked `async` if using `await` inside

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

  const accessToken = request.cookies.get("accessToken")?.value;
  const decodedToken = accessToken
    ? await jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!)
    : null;

  let userRole = null;
  if (!decodedToken?.success) {
    //token has expired or is invalid, redirect to login page
    cookieStore.delete("accessToken");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (decodedToken?.success && decodedToken.data) {
    userRole = (decodedToken.data as JwtPayload)?.role;
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
