export const revalidate = 60;

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getToken } from "next-auth/jwt"

export async function GET(req: Request) {
  // Get latest config
  const config = await db.adminConfig.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      usdtToInrRate: true,
      bonusRatio: true,
      bonusRatioInr: true,
    },
  })

  // Get user's payout profiles count if logged in
  const session = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET })
  const hasPayoutProfiles = session?.id ? 
    await db.payoutProfile.count({
      where: { userId: session.id }
    }) > 0 : false

  const res = NextResponse.json({
    rates: config ?? null,
    hasPayoutProfiles,
  },{
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
    },
  })
  return res
}
