// middleware.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run for /admin and /api/admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Use getToken instead of importing full auth.ts (smaller bundle)

    console.log("NextAuth Secret:", process.env.NEXTAUTH_SECRET);

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Middleware token:", token);

    // Check if token exists and has correct role
    if (!token || token.role !== "ADMIN") {

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
