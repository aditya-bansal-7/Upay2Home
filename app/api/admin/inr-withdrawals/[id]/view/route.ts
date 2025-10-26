import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/admin/inr-withdrawals/[id]/view">) {
  const { id } = await ctx.params

  const tx = await db.iNRTransaction.findUnique({
    where: { id: id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          createdAt: true,
        },
      },
      payoutProfile: {
        select: {
          type: true,
          upiVpa: true,
          accountHolder: true,
          accountNumber: true,
          ifsc: true,
          bankName: true,
          branch: true,
          createdAt: true,
        },
      }
    },
  })

  if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({
    id: tx.id,
    status: tx.status,
    inrAmount: tx.inrAmount,
    relatedDepositId: tx.relatedDepositId,
    usdtAmount: tx.usdtAmount,
    effectiveRate: tx.effectiveRate,
    createdAt: tx.createdAt,
    user: tx.user,
    payoutProfile: tx.payoutProfile,
  })
}
