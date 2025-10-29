// /app/api/team/route.ts
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 })
        }

        const user = await db.user.findUnique({
            where: { userId },
            include: {
                referrals: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const commissionResult = await db.referralBonus.aggregate({
            _sum: {
                amountInr: true,
            },
            where: {
                referrerId: user.id,
            },
        });

        const totalCommission = commissionResult._sum.amountInr || 0;

        const teamRechargeResult = await db.referralBonus.aggregate({
            _sum: {
                amountInr: true,
            },
            where: {
                referrerId: user.id,
            },
        });

        const teamRecharge = teamRechargeResult._sum.amountInr || 0;

        return NextResponse.json({
            referrals: user.referrals,
            totalCommission,
            teamRecharge,
        })
    } catch (err) {
        console.error("Team API error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}