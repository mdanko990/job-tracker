import type { PrismaClient } from "@job-tracker/db";

export type UserSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export type CreateContextOptions = {
  prisma: PrismaClient;
  session: UserSession | null;
};

export function createContext({ prisma, session }: CreateContextOptions) {
  return { prisma, session };
}

export type Context = ReturnType<typeof createContext>;
