import { adminProtectedRequest } from "@/lib/admin";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminProtectedRequest(async (req: NextRequest) => {
  // Your admin-only API logic here
  return NextResponse.json({ message: "Admin only data" });
});

export const POST = adminProtectedRequest(async (req: NextRequest) => {
  // Your admin-only API logic here
  return NextResponse.json({ message: "Admin config updated" });
});
