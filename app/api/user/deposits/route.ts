import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId") || ""

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { amount, txHash, profileId } = body

    // Validate inputs
    if (!amount || !txHash  || !profileId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const adminConfig = await db.adminConfig.findFirst({})

    const inrAmount = Number(adminConfig?.usdtToInrRate) * amount;

    // Create deposit record
    const deposit = await db.iNRTransaction.create({
      data: {
        userId,
        type: "CONVERT",

        usdtAmount:amount,
        inrAmount,
        effectiveRate: adminConfig?.usdtToInrRate,
        relatedDepositId: txHash,
        payoutProfileId: profileId,

        status: "PENDING",
      },
    })
    await db.user.update({
      where: { id: userId },
      data: {
        pendingConversions: {
          increment: inrAmount,
        },
      },
    })
    return NextResponse.json({ deposit })
  } catch (error) {
    console.error("Failed to create deposit:", error)
    return NextResponse.json(
      { error: "Failed to process deposit" },
      { status: 500 }
    )
  }
}
