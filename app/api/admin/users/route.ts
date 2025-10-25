import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

const ITEMS_PER_PAGE = 10;

export const GET = adminProtectedRequest(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";

  const where = {
    isDeleted: false,
    AND: [
      search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      } : {},
      status !== "All" ? {
        ...(status === "Active" ? { isBlocked: false } : 
            status === "Blocked" ? { isBlocked: true } : {})
      } : {},
    ],
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        userId: true,
        isBlocked: true,
        role: true,
        usdtBalance: true,
        inrBalance: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.user.count({ where }),
  ]);

  const res = NextResponse.json({
    users,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
    total,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
