import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function isAdminRequest() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function adminProtectedRequest(handler: Function) {
  return async (...args: any[]) => {
    const isAdmin = await isAdminRequest();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    return handler(...args);
  };
}
