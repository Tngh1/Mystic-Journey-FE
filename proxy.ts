import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/manage-achievements",
  "/manage-admins",
  "/manage-content",
  "/manage-dungeons",
  "/manage-gacha-pools",
  "/manage-game-config",
  "/manage-items",
  "/manage-mailbox",
  "/manage-monsters",
  "/manage-players",
  "/manage-quests",
  "/manage-shop",
  "/manage-transactions",
  "/account",
];

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
