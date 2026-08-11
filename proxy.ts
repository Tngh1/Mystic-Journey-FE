import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Every admin screen lives at /manage-*, and no public route starts with that
   prefix, so one prefix covers the whole (dashboard) group.

   This was an explicit list of 12 routes, and it had drifted: /manage-accounts,
   /manage-category-content and /manage-daily-login were added later and never
   listed, so guests could load three admin pages. (/manage-category-content
   does not match a /manage-content prefix either.) Enumerating is fail-open —
   a new page is public until someone remembers this file. The prefix is
   fail-closed. */
const protectedRoutes = ["/dashboard", "/manage-", "/account"];

const guestRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isGuestRoute = guestRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const accessToken = request.cookies.get("access_token")?.value;
  const isAuthenticated = !!accessToken;

  if (isGuestRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/).*)",
  ],
};
