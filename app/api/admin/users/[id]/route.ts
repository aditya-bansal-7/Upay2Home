import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

export const PATCH = adminProtectedRequest(async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;                // unwrap params
  const { action } = await req.json();

  if (!["block", "unblock"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const user = await db.user.update({
    where: { id },
    data: { isBlocked: action === "block" },
  });

  return NextResponse.json({ user });
});

export const DELETE = adminProtectedRequest(async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;                // unwrap params

  const user = await db.user.update({
    where: { id },
    data: { isDeleted: true },
  });

  return NextResponse.json({ user });
});
