import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";
import { INRTransactionStatus } from "@prisma/client";

// Helper: previous month range
function getPrevMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start, end };
}

function formatChange(current: number, prev: number) {
  if (prev === 0) return current === 0 ? "0.0%" : "+100.0%";
  const pct = ((current - prev) / prev) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export const GET = adminProtectedRequest(async (req: Request) => {
  const { start: prevStart, end: prevEnd } = getPrevMonthRange();

  const totalUsers = await db.user.count();
  const prevMonthUsers = await db.user.count({
    where: { createdAt: { gte: prevStart, lt: prevEnd } },
  });

  const activeUsers = await db.user.count({ where: { isBlocked: false } });
  const prevActiveUsers = await db.user.count({
    where: { isBlocked: false, createdAt: { gte: prevStart, lt: prevEnd } },
  });

  const depositsAgg = await db.iNRTransaction.aggregate({
    _sum: { inrAmount: true },
    where: { status: INRTransactionStatus.COMPLETED },
  })
  const prevDepositsAgg = await db.iNRTransaction.aggregate({
    _sum: { inrAmount: true },
    where: { createdAt: { gte: prevStart, lt: prevEnd }, status: INRTransactionStatus.COMPLETED },
  });
  const totalDeposits = Number(depositsAgg._sum.inrAmount ?? 0);
  const prevDeposits = Number(prevDepositsAgg._sum.inrAmount ?? 0);

  const pendingWithdrawals = await db.iNRTransaction.count({
    where: { type: "CONVERT", status: { in: ["PENDING"] } },
  });
  const prevPendingWithdrawals = await db.iNRTransaction.count({
    where: {
      type: "CONVERT",
      status: { in: ["PENDING"] },
      createdAt: { gte: prevStart, lt: prevEnd },
    },
  });

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      valueFormatted: totalUsers.toLocaleString(),
      change: formatChange(totalUsers, prevMonthUsers),
    },
    {
      label: "Total Deposits",
      value: totalDeposits,
      valueFormatted: `₹${totalDeposits.toLocaleString()}`,
      change: formatChange(totalDeposits, prevDeposits),
    },
    {
      label: "Active Users",
      value: activeUsers,
      valueFormatted: activeUsers.toLocaleString(),
      change: formatChange(activeUsers, prevActiveUsers),
    },
    {
      label: "Pending Withdrawals",
      value: pendingWithdrawals,
      valueFormatted: `${pendingWithdrawals}`,
      change: formatChange(pendingWithdrawals, prevPendingWithdrawals),
    },
  ];

  const res = NextResponse.json({ stats });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
