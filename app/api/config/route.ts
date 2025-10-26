import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const config = await db.adminConfig.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      usdtToInrRate: true,
      bonusRatio: true,
      bonusRatioInr: true,
      depositAddress: true,
      qrCode: true,
      telegram: true,
      whatsapp: true,
    },
  })
  const res = NextResponse.json({ config: config ?? null })
  res.headers.set("Cache-Control", "no-store")
  return res
}