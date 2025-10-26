import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

function getLast6Months() {
  const now = new Date();
  const months: { label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("default", { month: "short" }),
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1),
    });
  }
  return months;
}

export const GET = adminProtectedRequest(async (req: Request) => {
  const months = getLast6Months();

  const data = await Promise.all(
    months.map(async ({ label, start, end }) => {
      const revAgg = await db.iNRTransaction.aggregate({
        _sum: { inrAmount: true },
        where: { type: "CONVERT", status: { in: ["COMPLETED"] }, createdAt: { gte: start, lt: end } },
      });
      const newUsers = await db.user.count({ where: { createdAt: { gte: start, lt: end } } });
      return { month: label, revenue: Number(revAgg._sum.inrAmount ?? 0), users: newUsers };
    })
  );

  const res = NextResponse.json({ revenueData: data });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
