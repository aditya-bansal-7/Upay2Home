import { NextRequest, NextResponse } from "next/server"
import { INRTransactionStatus, INRTransactionType } from "@prisma/client"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Only consider CONVERT transactions for “Conversions” stats. Adjust if you want WITHDRAW included.
  const baseWhere = { userId, type: INRTransactionType.CONVERT }

  const [completedAgg, pendingAgg] = await Promise.all([
    db.iNRTransaction.aggregate({
      _sum: { inrAmount: true },
      where: { ...baseWhere, status: INRTransactionStatus.COMPLETED },
    }),
    db.iNRTransaction.aggregate({
      _sum: { inrAmount: true },
      where: { ...baseWhere, status: { in: [INRTransactionStatus.PENDING] } },
    }),
  ])

  // Convert Decimal | null to number
  const totalConversions = Number(completedAgg._sum.inrAmount || 0)
  const pendingConversions = Number(pendingAgg._sum.inrAmount || 0)

  return NextResponse.json({
    totalConversions,
    pendingConversions,
  })
}
