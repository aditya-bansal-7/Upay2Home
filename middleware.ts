import { NextResponse } from "next/server";
import { auth } from "./app/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminPanel = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin/");
  
  if (isAdminPanel) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.nextUrl));
    }
    console.log("isAdminPanel",req.auth?.user );
    const isAdmin = req.auth?.user?.role === "ADMIN";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }
  
  return NextResponse.next();
});

// Optionally cache the response
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
