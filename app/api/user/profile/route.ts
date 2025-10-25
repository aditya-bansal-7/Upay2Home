import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    const updatedUser = await db.user.update({
      where: { userId: body.id },
      data: { name },
    });
    return NextResponse.json(
      { user: { name: updatedUser.name, email: updatedUser.email } },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}