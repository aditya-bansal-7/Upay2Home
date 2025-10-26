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
  if (body.bonusRatio !== undefined) payload.bonusRatio = Number(body.bonusRatio);
  if (body.bonusRatioInr !== undefined) payload.bonusRatioInr = Number(body.bonusRatioInr);
  if (body.depositAddress !== undefined) payload.depositAddress = body.depositAddress;
  if (body.qrCode !== undefined) payload.qrCode = body.qrCode;
  if (body.telegram !== undefined) payload.telegram = body.telegram;
  if (body.whatsapp !== undefined) payload.whatsapp = body.whatsapp;

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
        bonusRatio: payload.bonusRatio ?? 0,
        bonusRatioInr: payload.bonusRatioInr ?? 0,
        notes: payload.notes ?? null,
        depositAddress: payload.depositAddress ?? null,
        qrCode: payload.qrCode ?? null,
        telegram: payload.telegram ?? null,
        whatsapp: payload.whatsapp ?? null,
      },
    });
  }

  const res = NextResponse.json({ config: result });
  res.headers.set("Cache-Control", "no-store");
  return res;
});
