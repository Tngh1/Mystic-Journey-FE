import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/manage-", "/account"];

const guestRoutes = ["/login", "/register", "/forget-password", "/reset-password"];

// Helper function executing proxy.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Helper function executing is protected route.
  // Processes input parameters and returns the calculated result.
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Helper function executing is guest route.
  // Processes input parameters and returns the calculated result.
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

// Helper function executing config.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/).*)",
  ],
};
