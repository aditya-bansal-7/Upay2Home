import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

export const GET = adminProtectedRequest(async (req: Request) => {
  const recent = await db.iNRTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { user: true },
  });

  const mapped = recent.map((tx) => ({
    id: tx.id,
    user: tx.user?.name ?? "Unknown",
    type: tx.type,
    amount: tx.inrAmount ? `$${tx.inrAmount}` : "-",
    status: tx.status,
    date: tx.createdAt.toISOString().slice(0, 10),
  }));

  const res = NextResponse.json({ recentTransactions: mapped });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
