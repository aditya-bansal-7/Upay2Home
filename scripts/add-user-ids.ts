// scripts/add-user-ids.ts
import { db } from "@/lib/db";

async function generateUniqueUserId(): Promise<string> {
  let userId: string;
  let isUnique = false;
  while (!isUnique) {
    userId = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUser = await db.user.findUnique({ where: { userId } });
    if (!existingUser) isUnique = true;
  }
  return userId!;
}

async function addUserIds() {
  const users = await db.user.findMany({ where: { userId: null } });
  
  for (const user of users) {
    const userId = await generateUniqueUserId();
    await db.user.update({
      where: { id: user.id },
      data: { userId },
    });
    console.log(`✅ Added userId ${userId} to ${user.email}`);
  }
  
  console.log(`Done! Updated ${users.length} users.`);
}

addUserIds();
