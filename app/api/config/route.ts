export const revalidate = 60; // cache for 60s on Vercel Edge or Next Cache

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
  });

  return NextResponse.json({ config: config ?? null },{
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
    },
  });
}
