import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

// Helper to resolve unique selector by id or 6-digit userId
function toUserWhereUnique(idOrUserId: string) {
  return /^\d{6}$/.test(idOrUserId) ? { userId: idOrUserId } : { id: idOrUserId };
}

export const GET = adminProtectedRequest(async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;                    // await params
  const user = await db.user.findUnique({
    where: toUserWhereUnique(id),
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      userId: true,
      role: true,
      isBlocked: true,
      isDeleted: true,
      kycVerified: true,
      usdtBalance: true,
      inrBalance: true,
      createdAt: true,
      payoutProfiles: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const res = NextResponse.json({ user });
  res.headers.set("Cache-Control", "no-store");
  return res;
});

export const PATCH = adminProtectedRequest(async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;                    // await params
  const body = await req.json().catch(() => ({} as any));
  const action = body?.action as "block" | "unblock" | "update" | undefined;
  const data = body?.data as any;

  // Toggle block/unblock
  if (action === "block" || action === "unblock") {
    const updated = await db.user.update({
      where: toUserWhereUnique(id),
      data: { isBlocked: action === "block" },
      select: { id: true, isBlocked: true },
    });
    return NextResponse.json({ user: updated });
  }

  // Update basic fields
  if (action === "update" && data) {
    const updated = await db.user.update({
      where: toUserWhereUnique(id),
      data: {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        kycVerified: typeof data.kycVerified === "boolean" ? data.kycVerified : undefined,
      },
      select: { id: true, name: true, email: true, phone: true, kycVerified: true },
    });
    return NextResponse.json({ user: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
});

export const DELETE = adminProtectedRequest(async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;                    // await params
  const deleted = await db.user.update({
    where: toUserWhereUnique(id),
    data: { isDeleted: true },
    select: { id: true, isDeleted: true },
  });
  return NextResponse.json({ user: deleted });
});
