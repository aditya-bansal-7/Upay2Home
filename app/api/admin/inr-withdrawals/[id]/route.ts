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

  // Fetch only what’s needed for validation
  const tx = await db.iNRTransaction.findUnique({
    where: { id },
    select: { status: true, type: true },
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
    return NextResponse.json({ ok: true, item: updated })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
