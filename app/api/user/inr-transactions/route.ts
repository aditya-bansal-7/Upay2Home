import { NextRequest, NextResponse } from "next/server"
import { INRTransactionStatus, INRTransactionType } from "@prisma/client" // add this
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {


  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  

  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 10)))

  const typeParam = searchParams.get("type")
  const statusParam = searchParams.get("status")
  const type = typeParam && Object.prototype.hasOwnProperty.call(INRTransactionType, typeParam)
    ? (typeParam as keyof typeof INRTransactionType)
    : null
  const status = statusParam && Object.prototype.hasOwnProperty.call(INRTransactionStatus, statusParam)
    ? (statusParam as keyof typeof INRTransactionStatus)
    : null

  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const cursor = searchParams.get("cursor")
  const dir = (searchParams.get("dir") || "forward") as "forward" | "backward"

  const where: any = { userId }
  if (type) where.type = INRTransactionType[type]
  if (status) where.status = INRTransactionStatus[status]
  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.gte = new Date(from + "T00:00:00.000Z")
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z")
  }

  const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }]
  let take = pageSize
  if (dir === "backward") take = -pageSize

  const query: any = {
    where,
    orderBy,
    take,
    select: {
      id: true,
      type: true,
      inrAmount: true,
      status: true,
      createdAt: true,
    },
  }

  if (cursor) {
    const decoded = Buffer.from(cursor, "base64").toString("utf8")
    const [cAt, cId] = decoded.split("|")
    query.cursor = { createdAt_id: { createdAt: new Date(cAt), id: cId } }
    query.skip = 1
  }

  const items = await db.iNRTransaction.findMany(query)

  const encodeCursor = (row: any | null) =>
    row ? Buffer.from(`${row.createdAt.toISOString()}|${row.id}`).toString("base64") : null

  const hasResults = items.length > 0
  const first = hasResults ? items[0] : null
  const last = hasResults ? items[items.length - 1] : null

  const nextProbe = hasResults
    ? await db.iNRTransaction.findFirst({
        where: {
          ...where,
          OR: [
            { createdAt: { lt: last!.createdAt } },
            { createdAt: last!.createdAt, id: { lt: last!.id } },
          ],
        },
        orderBy,
        select: { id: true },
      })
    : null

  const prevProbe = hasResults
    ? await db.iNRTransaction.findFirst({
        where: {
          ...where,
          OR: [
            { createdAt: { gt: first!.createdAt } },
            { createdAt: first!.createdAt, id: { gt: first!.id } },
          ],
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
      })
    : null

  const nextCursor = hasResults && nextProbe ? encodeCursor(last) : null
  const prevCursor = hasResults && prevProbe ? encodeCursor(first) : null

  // Use enums in aggregate filters and correct _sum shape
  const [processingAgg, completedAgg, totalCount] = await Promise.all([
    db.iNRTransaction.aggregate({
      _sum: { inrAmount: true },
      where: { 
        ...where, 
        status: { in: [INRTransactionStatus.PENDING] } 
      },
    }),
    db.iNRTransaction.aggregate({
      _sum: { inrAmount: true },
      where: { ...where, status: INRTransactionStatus.COMPLETED },
    }),
    db.iNRTransaction.count({ where }),
  ])

  return NextResponse.json({
    transactions: items,
    nextCursor,
    prevCursor,
    totalCount,
    totalProcessing: Number(processingAgg._sum.inrAmount || 0),
    totalCompleted: Number(completedAgg._sum.inrAmount || 0),
  })
}
