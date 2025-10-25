import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getToken } from "next-auth/jwt"

export async function GET() {
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
  const session = await getToken({ req: {} as any, secret: process.env.NEXTAUTH_SECRET })
  const hasPayoutProfiles = session?.id ? 
    await db.payoutProfile.count({
      where: { id: session.id }
    }) > 0 : false

  const res = NextResponse.json({
    rates: config ?? null,
    hasPayoutProfiles,
  })
  res.headers.set("Cache-Control", "no-store")
  return res
}
