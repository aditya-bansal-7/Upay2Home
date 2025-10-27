import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  try {
    await db.payoutProfile.delete({ where: { id } })
    revalidatePath(`/api/payout-profiles`);
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
  }
}
