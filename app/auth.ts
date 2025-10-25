// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { generateUniqueUserId } from "@/lib/generate-user-id";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      userId: string;
      image: string | undefined;
    };
  }
  interface User {
    role: string;
    userId: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials, request) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.userId) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password!);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: user.role,
          userId: user.userId
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.userId = token.userId as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Generate userId when user is created
      const userId = await generateUniqueUserId();
      await db.user.update({
        where: { id: user.id },
        data: { userId },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
