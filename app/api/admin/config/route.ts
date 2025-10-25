import { adminProtectedRequest } from "@/lib/admin";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = adminProtectedRequest(async (req: NextRequest) => {
  const config = await db.adminConfig.findFirst({
    orderBy: { createdAt: "desc" },
  });
  const res = NextResponse.json({ config: config ?? null });
  res.headers.set("Cache-Control", "no-store");
  return res;
});

export const PATCH = adminProtectedRequest(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  const payload: any = {};

  if (body.usdtToInrRate !== undefined) payload.usdtToInrRate = body.usdtToInrRate;
  if (body.depositFeeBps !== undefined) payload.depositFeeBps = Number(body.depositFeeBps);
  if (body.withdrawFeeBps !== undefined) payload.withdrawFeeBps = Number(body.withdrawFeeBps);
  if (body.minDepositUSDT !== undefined) payload.minDepositUSDT = body.minDepositUSDT;
  if (body.minWithdrawINR !== undefined) payload.minWithdrawINR = body.minWithdrawINR;
  if (body.allowDeposits !== undefined) payload.allowDeposits = Boolean(body.allowDeposits);
  if (body.allowWithdrawals !== undefined) payload.allowWithdrawals = Boolean(body.allowWithdrawals);
  if (body.notes !== undefined) payload.notes = body.notes;

  // update existing config if present, otherwise create
  const existing = await db.adminConfig.findFirst({ orderBy: { createdAt: "desc" } });

  let result;
  if (existing) {
    result = await db.adminConfig.update({
      where: { id: existing.id },
      data: {
        ...payload,
        updatedAt: new Date(),
      },
    });
  } else {
    result = await db.adminConfig.create({
      data: {
        usdtToInrRate: payload.usdtToInrRate ?? "0",
        depositFeeBps: payload.depositFeeBps ?? 0,
        withdrawFeeBps: payload.withdrawFeeBps ?? 0,
        minDepositUSDT: payload.minDepositUSDT ?? "0",
        minWithdrawINR: payload.minWithdrawINR ?? "0",
        allowDeposits: payload.allowDeposits ?? true,
        allowWithdrawals: payload.allowWithdrawals ?? true,
        notes: payload.notes ?? null,
      },
    });
  }

  const res = NextResponse.json({ config: result });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
