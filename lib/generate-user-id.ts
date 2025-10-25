// lib/generate-user-id.ts
import { db } from "@/lib/db";

export async function generateUniqueUserId(): Promise<string> {
  let userId: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate random 6-digit number (100000 to 999999)
    userId = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if it already exists
    const existingUser = await db.user.findUnique({
      where: { userId },
    });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return userId!;
}
