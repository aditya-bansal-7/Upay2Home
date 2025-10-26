import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId") || ""

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { amount, txHash, chain, profileId } = body

    // Validate inputs
    if (!amount || !txHash || !chain || !profileId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create deposit record
    const deposit = await db.cryptoDeposit.create({
      data: {
        userId: userId,
        txHash,
        chain,
        fromAddress: "unknown", // will be updated when detected on chain
        toAddress: "platform", // will be updated when detected on chain
        amountUSDT: amount,
        status: "DETECTED",
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
