import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@job-tracker/db/prisma";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig.callbacks,
  secret: process.env.BETTER_AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id; // Attach DB user ID to the session object
      }
      return session;
    },
  },
});
