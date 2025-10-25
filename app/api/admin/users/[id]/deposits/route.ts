import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

// Accepts either numeric 6-digit userId or internal user UUID and normalizes to deposit filter
function toDepositWhereUser(userIdOrUuid: string) {
  // If you store 6-digit numeric ID on deposits as userId (string)
  if (/^\d{6}$/.test(userIdOrUuid)) return { userId: userIdOrUuid };
  // If deposits reference user by foreign key userIdFk to User.id (adjust field name as needed)
  return { userIdFk: userIdOrUuid };
}

export const GET = adminProtectedRequest(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;                     // await params in Next.js 15
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const url = new URL(req.url);

  const pageRaw = url.searchParams.get("page") ?? "1";
  const sizeRaw = url.searchParams.get("pageSize") ?? "10";
  const page = Number.isNaN(Number(pageRaw)) ? 1 : Math.max(1, Number(pageRaw));
  const pageSize = Number.isNaN(Number(sizeRaw)) ? 10 : Math.max(1, Math.min(100, Number(sizeRaw)));

  const status = url.searchParams.get("status") ?? undefined;

  const whereBase: any = toDepositWhereUser(id);
  const where = status ? { ...whereBase, status } : whereBase;

  const [items, total] = await Promise.all([
    db.cryptoDeposit.findMany({
      where,
      orderBy: { detectedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        txHash: true,
        chain: true,
        network: true,
        fromAddress: true,
        toAddress: true,
        amountUSDT: true,
        status: true,
        confirmations: true,
        detectedAt: true,
        confirmedAt: true,
        creditedAt: true,
        failedAt: true,
        failReason: true,
      },
    }),
    db.cryptoDeposit.count({ where }),
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
