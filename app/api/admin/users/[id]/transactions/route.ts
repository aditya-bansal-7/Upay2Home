import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

// If your route is /api/admin/inr-transactions/[id],
// we assume [id] is the 6-digit userId string stored on INRTransaction.userId.
export const GET = adminProtectedRequest(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;                                 // await params (Next.js 15)
  const userId = id;
  if (!userId) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const url = new URL(req.url);
  const pageRaw = url.searchParams.get("page") ?? "1";
  const sizeRaw = url.searchParams.get("pageSize") ?? "10";
  const page = Number.isNaN(Number(pageRaw)) ? 1 : Math.max(1, Number(pageRaw));
  const pageSize = Number.isNaN(Number(sizeRaw)) ? 10 : Math.max(1, Math.min(100, Number(sizeRaw)));

  // Optional filters
  const type = url.searchParams.get("type") ?? undefined;          // e.g., "CONVERT" | "WITHDRAW"
  const status = url.searchParams.get("status") ?? undefined;      // match your enum/string

  // Build where clause
  const where: any = { userId };
  if (type) where.type = type;
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    db.iNRTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        type: true,
        usdtAmount: true,
        inrAmount: true,
        effectiveRate: true,
        feeInr: true,
        status: true,
        providerRef: true,
        remarks: true,
        executedAt: true,
        completedAt: true,
        failedAt: true,
        failReason: true,
        createdAt: true,
      },
    }),
    db.iNRTransaction.count({ where }),
  ]);

  const res = NextResponse.json({
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    currentPage: page,
    pageSize,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
