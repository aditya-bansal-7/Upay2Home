export const revalidate = 60; 

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      totalConversions: true,
      pendingConversions: true,
    },
  })

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  return NextResponse.json(
    {
      totalConversions: Number(user.totalConversions),
      pendingConversions: Number(user.pendingConversions),
    },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
      },
    }
  )
}
