import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { INRTransactionStatus } from "@prisma/client"
import { db } from "@/lib/db"

// Strongly typed params from the route literal:
export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/inr-withdrawals/[id]">
) {
  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const action: "approve" | "reject" = body.action
  const reason: string | undefined = body.reason
  const partialAmount: number | undefined = body.partialAmount

  // Fetch only what’s needed for validation
  const tx = await db.iNRTransaction.findUnique({
    where: { id },
    select: { status: true, type: true, userId: true, inrAmount: true },
  })
  if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 })
  
  if (tx.status !== INRTransactionStatus.PENDING) {
    return NextResponse.json({ error: "Only pending withdrawals can be updated" }, { status: 400 })
  }

  if (action === "approve") {
    const updated = await db.iNRTransaction.update({
      where: { id },
      data: {
        status: INRTransactionStatus.COMPLETED,
        completedAt: new Date(),
        remarks: reason ?? undefined,
      },
      select: { id: true, status: true, completedAt: true },
    })
    await db.user.update({
      where: { id: tx.userId },
      data: {
        totalConversions: {
          increment: tx.inrAmount,
        },
        pendingConversions: {
          decrement: tx.inrAmount,
        },
      },
    })
    const user = await db.user.findUnique({
      where: { id: tx.userId },
    })

    const config = await db.adminConfig.findFirst()

    if (user?.referredById) {
      await db.referralBonus.create({
        data: {
          referrerId: user.referredById,
          referredUserId: user.id,
          depositId: updated.id,
          amountInr: tx.inrAmount,
          bonusPercent: config?.referralBonusPercent || 0,
          status: "PENDING",
        }
      })

      const refAmount =
        (Number(tx.inrAmount) * Number(config?.referralBonusPercent || 0)) / 100;


      await db.user.update({
        where: { id: user.referredById },
        data: {
          inrBalance: {
            increment: refAmount
          },
        },
      })
    }

    return NextResponse.json({ ok: true, item: updated })
  }

  if (action === "reject") {
    const updated = await db.iNRTransaction.update({
      where: { id },
      data: {
        status: INRTransactionStatus.FAILED,
        failedAt: new Date(),
        failReason: reason ?? undefined,
        remarks: reason ?? undefined,
      },
      select: { id: true, status: true, failedAt: true },
    })
    await db.user.update({
      where: { id: tx.userId },
      data: {
        pendingConversions: {
          decrement: tx.inrAmount,
        },
      },
    })
    return NextResponse.json({ ok: true, item: updated })
  }

  if (action === "partial") {
    if (!partialAmount || partialAmount <= 0)
      return NextResponse.json({ error: "Partial amount must be greater than 0" }, { status: 400 })

    if (partialAmount > Number(tx.inrAmount))
      return NextResponse.json({ error: "Partial amount cannot exceed total withdrawal amount" }, { status: 400 })

    const updated = await db.iNRTransaction.update({
      where: { id },
      data: {
        remarks: reason ?? `Partial payment of ₹${partialAmount}`,
        partialAmount,
        inrAmount: Number(tx.inrAmount) - partialAmount,
        updatedAt: new Date(),
      },
      select: { id: true, status: true, remarks: true },
    })

    await db.user.update({
      where: { id: tx.userId },
      data: {
        pendingConversions: { decrement: partialAmount },
        totalConversions: { increment: partialAmount },
      },
    })

    return NextResponse.json({ ok: true, item: updated })
  }


  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
