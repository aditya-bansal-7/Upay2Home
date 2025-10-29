import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

// Helper: get last 6 months labels and date ranges
function getLast6Months() {
  const now = new Date();
  const months: { label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const label = start.toLocaleString("default", { month: "short" });
    months.push({ label, start, end });
  }
  return months;
}

export const GET = adminProtectedRequest(async (req: Request) => {
  // Get current and previous month date ranges
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = currentMonthStart;

  // Total users (current and previous month)
  const totalUsers = await db.user.count();
  const prevMonthUsers = await db.user.count({
    where: {
      createdAt: { gte: prevMonthStart, lt: prevMonthEnd }
    }
  });

  // Active users (current and previous month)
  const activeUsers = await db.user.count({ where: { isBlocked: false } });
  const prevMonthActiveUsers = await db.user.count({
    where: {
      isBlocked: false,
      createdAt: { gte: prevMonthStart, lt: prevMonthEnd }
    }
  });

  // Total deposits (current and previous month)
  const totalDeposits = await db.iNRTransaction.aggregate({
    _sum: { inrAmount: true }
  });
  const prevMonthDeposits = await db.iNRTransaction.aggregate({
    _sum: { inrAmount: true },
    where: {
      createdAt: { gte: prevMonthStart, lt: prevMonthEnd }
    }
  });

  // Pending withdrawals (current and previous month)
  const pendingWithdrawals = await db.iNRTransaction.count({
    where: { type: "WITHDRAW", status: { in: ["PENDING"] } }
  });
  const prevMonthPendingWithdrawals = await db.iNRTransaction.count({
    where: {
      type: "WITHDRAW",
      status: { in: ["PENDING"] },
      createdAt: { gte: prevMonthStart, lt: prevMonthEnd }
    }
  });

  // Revenue & users per month (last 6 months)
  const months = getLast6Months();
  const revenueData = await Promise.all(
    months.map(async ({ label, start, end }) => {
      // Revenue: sum inrAmount for CONVERT transactions in this month
      const revenueAgg = await db.iNRTransaction.aggregate({
        _sum: { inrAmount: true },
        where: {
          type: "CONVERT",
          createdAt: { gte: start, lt: end }
        }
      });
      // New users: count users created in this month
      const newUsers = await db.user.count({
        where: {
          createdAt: { gte: start, lt: end }
        }
      });
      return {
        month: label,
        revenue: Number(revenueAgg._sum.inrAmount ?? 0),
        users: newUsers
      };
    })
  );

  // Recent transactions (last 5 INRTransaction)
  const recentTx = await db.iNRTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true }
  });

  // Helper for percent change
  function percentChange(current: number, prev: number) {
    if (prev === 0) return current === 0 ? 0 : 100;
    return ((current - prev) / prev) * 100;
  }

  // Compose dashboard stats
  const dashboardStats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      change: `${percentChange(totalUsers, prevMonthUsers).toFixed(1)}%`
    },
    {
      label: "Total Deposits",
      value: `$${(totalDeposits._sum.inrAmount ?? 0).toLocaleString()}`,
      change: `${percentChange(Number(totalDeposits._sum.inrAmount ?? 0), Number(prevMonthDeposits._sum.inrAmount ?? 0)).toFixed(1)}%`
    },
    {
      label: "Active Users",
      value: activeUsers.toLocaleString(),
      change: `${percentChange(activeUsers, prevMonthActiveUsers).toFixed(1)}%`
    },
    {
      label: "Pending Withdrawals",
      value: pendingWithdrawals.toLocaleString(),
      change: `${percentChange(pendingWithdrawals, prevMonthPendingWithdrawals).toFixed(1)}%`
    },
  ];

  const userDistribution = [
    { name: "Active", value: activeUsers, color: "#000000" },
    { name: "Inactive", value: 0, color: "#d4d4d8" },
    { name: "Suspended", value: await db.user.count({ where: { role: "USER", isBlocked: true } }), color: "#ef4444" },
  ];

  const recentTransactions = recentTx.map(tx => ({
    id: tx.id,
    user: tx.user?.name ?? "Unknown",
    type: tx.type,
    amount: tx.inrAmount ? `$${tx.inrAmount}` : "-",
    status: tx.status,
    date: tx.createdAt.toISOString().slice(0, 10),
  }));

  return NextResponse.json({
    dashboardStats,
    revenueData,
    userDistribution,
    recentTransactions,
  });
});
