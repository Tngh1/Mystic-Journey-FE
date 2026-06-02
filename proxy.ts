import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// // Routes that require authentication
// const protectedRoutes = [
//   "/dashboard",
//   "/manage-achievements",
//   "/manage-admins",
//   "/manage-content",
//   "/manage-dungeons",
//   "/manage-gacha-pools",
//   "/manage-game-config",
//   "/manage-items",
//   "/manage-mailbox",
//   "/manage-monsters",
//   "/manage-players",
//   "/manage-quests",
//   "/manage-shop",
//   "/manage-transactions",
//   "/account",
// ];

// Routes only for guests (redirect to dashboard if logged in)
const guestRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // // Check if the current path starts with any protected route
  // const isProtectedRoute = protectedRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // // Check if the current path is a guest route
  // const isGuestRoute = guestRoutes.some((route) => pathname.startsWith(route));

  // // Get the auth token from cookies
  // const authToken =
  //   request.cookies.get("auth_token")?.value ||
  //   request.cookies.get("token")?.value ||
  //   request.cookies.get("accessToken")?.value;

  // // For demo purposes, also check localStorage-like token (we'll use a cookie for this)
  // const demoAuthCookie = request.cookies.get("demo_auth")?.value;

  // // If user is authenticated (has any auth token)
  // const isAuthenticated = !!(authToken || demoAuthCookie);

  // // Redirect authenticated users away from guest routes
  // if (isGuestRoute && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // // Redirect unauthenticated users to login
  // if (isProtectedRoute && !isAuthenticated) {
  //   const loginUrl = new URL("/login", request.url);
  //   // Add the original URL as a redirect parameter
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // return NextResponse.next();
}

// Configure which paths the proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/).*)",
  ],
};
