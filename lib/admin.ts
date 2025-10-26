import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export function adminProtectedRequest(handler: Function) {
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

export async function isAdminRequest() {
  return true;
}
