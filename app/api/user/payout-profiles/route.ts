export const revalidate = 60;

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "";

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles = await db.payoutProfile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    { profiles },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, upiVpa, accountHolder, accountNumber, ifsc, bankName, userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (type !== "UPI" && type !== "BANK") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (type === "UPI" && !upiVpa) {
    return NextResponse.json({ error: "UPI VPA is required" }, { status: 400 });
  }
  if (type === "BANK" && (!accountNumber || !ifsc || !bankName)) {
    return NextResponse.json({ error: "All bank details are required" }, { status: 400 });
  }

  try {
    const profile = await db.payoutProfile.create({
      data: {
        userId,
        type,
        upiVpa: type === "UPI" ? upiVpa : null,
        accountHolder: accountHolder || "Account",
        accountNumber: type === "BANK" ? accountNumber : null,
        ifsc: type === "BANK" ? ifsc : null,
        bankName: type === "BANK" ? bankName : null,
        isActive: true,
      },
    });

    // 👇 Trigger revalidation for the GET route
    revalidatePath(`/api/payout-profiles`);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Failed to create payout profile:", error);
    return NextResponse.json(
      { error: "Failed to create payout profile" },
      { status: 500 }
    );
  }
}
