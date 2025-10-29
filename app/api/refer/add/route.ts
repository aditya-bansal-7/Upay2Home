import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function POST(req: Request) {

  const { referralCode, userId } = await req.json()
  if (!referralCode) {
    return NextResponse.json({ error: "Referral code is required" }, { status: 400 })
  }

  // Find current user
  const user = await db.user.findUnique({ where: { userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (user.referredById) {
    return NextResponse.json({ error: "Referral code already added" }, { status: 400 })
  }

  // Find referrer by userId
  const referrer = await db.user.findUnique({ where: { userId: referralCode } })
  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
  }

  if (referrer.id === user.id) {
    return NextResponse.json({ error: "You can't refer yourself" }, { status: 400 })
  }

  if( user.createdAt > referrer.createdAt) {
    return NextResponse.json({ error: "You can't refer someone who is older than you" }, { status: 400 })
  }
  // Update referredById
  await db.user.update({
    where: { id: user.id },
    data: { referredById: referrer.id },
  })

  return NextResponse.json({ message: "Referral code added successfully!" }, { status: 200 })
}
