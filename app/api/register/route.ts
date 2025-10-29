// /app/api/register/route.ts
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(), // 👈 optional field
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, referralCode } = userSchema.parse(body);

    // check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 find referrer if referralCode provided
    let referrer = null;
    if (referralCode) {
      referrer = await db.user.findUnique({
        where: { userId: referralCode },
      });
    }

    // create user with optional referredById
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referredById: referrer ? referrer.id : null,
      },
    });

    return NextResponse.json(
      { user: { name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
