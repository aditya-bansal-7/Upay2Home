import { auth } from "@/app/auth";
import "next-auth";

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function requireAdmin() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
}
