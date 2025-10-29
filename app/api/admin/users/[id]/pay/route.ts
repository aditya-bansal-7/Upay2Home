import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { amount } = await req.json()
    const { id: userId } = await context.params 

    console.log(userId)

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newBalance = Number(user.inrBalance ?? 0) - Number(amount)
    if (newBalance < 0) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Update balance
    await db.user.update({
      where: { id: userId },
      data: { inrBalance: newBalance },
    })

    await db.iNRTransaction.create({
        data: {
          userId,
          type: "WITHDRAW",
          usdtAmount: amount,
          inrAmount: amount,
          effectiveRate: 1,
          relatedDepositId: null,
          payoutProfileId: null,
          status: "COMPLETED",
          providerRef: null,
          remarks: null,
          executedAt: new Date(),
          completedAt: new Date(),
          failedAt: null,
          failReason: null,
        }
    }
    )

    return NextResponse.json({ success: true, newBalance })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
