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
      minDepositUSDT: true,
    },
  })
  const res = NextResponse.json({ config: config ?? null },
    {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
    },
  }
  )
  return res
}