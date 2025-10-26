import { NextRequest, NextResponse } from "next/server"
import { INRTransactionStatus, INRTransactionType } from "@prisma/client"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim() || ""
  const statusParam = searchParams.get("status") as keyof typeof INRTransactionStatus | null
  const status = statusParam ? INRTransactionStatus[statusParam] : undefined
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 10)))
  const cursor = searchParams.get("cursor") || ""

  const where: any = { type: INRTransactionType.CONVERT }
  if (status) where.status = status
  if (q) {
    where.user = {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    }
  }

  const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }]

  // Use include so tx.user and tx.payoutProfile exist in type and runtime
  const pageQuery = {
    where,
    orderBy,
    take: pageSize,
    include: {
      user: { select: { name: true, email: true } },
      payoutProfile: { select: { accountNumber: true, upiVpa: true, bankName: true } },
    },
  } as const

  if (cursor) {
    const decoded = Buffer.from(cursor, "base64").toString("utf8")
    const [cAt, cId] = decoded.split("|")
    ;(pageQuery as any).cursor = { createdAt_id: { createdAt: new Date(cAt), id: cId } }
    ;(pageQuery as any).skip = 1
  }

  const items = await db.iNRTransaction.findMany(pageQuery)

  const hasResults = items.length > 0
  const first = hasResults ? items[0] : null
  const last = hasResults ? items[items.length - 1] : null
  const encode = (row: any | null) => (row ? Buffer.from(`${row.createdAt.toISOString()}|${row.id}`).toString("base64") : null)

  // Stats
  const [pendingCount, approvedCount, rejectedCount, totalAmountAgg] = await Promise.all([
    db.iNRTransaction.count({ where: { ...where, status: INRTransactionStatus.PENDING } }),
    db.iNRTransaction.count({ where: { ...where, status: INRTransactionStatus.COMPLETED } }),
    db.iNRTransaction.count({ where: { ...where, status: INRTransactionStatus.FAILED } }),
    db.iNRTransaction.aggregate({ _sum: { inrAmount: true }, where: { ...where, status: INRTransactionStatus.COMPLETED } }),
  ])

  // Probes
  const nextProbe = hasResults
    ? await db.iNRTransaction.findFirst({
        where: {
          ...where,
          OR: [{ createdAt: { lt: last!.createdAt } }, { createdAt: last!.createdAt, id: { lt: last!.id } }],
        },
        orderBy,
        select: { id: true },
      })
    : null

  const prevProbe = hasResults
    ? await db.iNRTransaction.findFirst({
        where: {
          ...where,
          OR: [{ createdAt: { gt: first!.createdAt } }, { createdAt: first!.createdAt, id: { gt: first!.id } }],
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
      })
    : null

  return NextResponse.json({
    items: items.map((tx) => ({
      id: tx.id,
      user: { name: tx.user?.name ?? "", email: tx.user?.email ?? "" },
      amountInr: Number(tx.inrAmount),
      method: tx.payoutProfile?.upiVpa ? "UPI" : tx.payoutProfile?.bankName ? "Bank Transfer" : "Unknown",
      accountDetails: tx.payoutProfile?.upiVpa
        ? tx.payoutProfile.upiVpa
        : tx.payoutProfile?.accountNumber
        ? `****${tx.payoutProfile.accountNumber.slice(-4)}`
        : "-",
      status: tx.status,
      requestDate: tx.createdAt,
      providerRef: tx.providerRef ?? null,
      remarks: tx.remarks ?? null,
    })),
    nextCursor: hasResults && nextProbe ? encode(last) : null,
    prevCursor: hasResults && prevProbe ? encode(first) : null,
    stats: {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      totalAmount: Number(totalAmountAgg._sum.inrAmount || 0),
    },
  })
}
