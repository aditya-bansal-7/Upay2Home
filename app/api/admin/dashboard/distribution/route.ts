import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminProtectedRequest } from "@/lib/admin";

export const GET = adminProtectedRequest(async (req: Request) => {
  const active = await db.user.count({ where: { isBlocked: false } });
  const inactive = 0; // per your requirement
  const suspended = await db.user.count({ where: { role: "USER", isBlocked: true } });

  const data = [
    { name: "Active", value: active, color: "#000000" },
    { name: "Inactive", value: inactive, color: "#d4d4d8" },
    { name: "Suspended", value: suspended, color: "#ef4444" },
  ];

  const res = NextResponse.json({ distribution: data });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
