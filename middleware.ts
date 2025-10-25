import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define which routes to protect
const adminRoutes = ["/admin", "/api/admin"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdminRoute = adminRoutes.some((prefix) => req.nextUrl.pathname.startsWith(prefix));

  if (isAdminRoute) {
    // Check if logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check if user is admin
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware on these routes
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
