import crypto from "node:crypto";
import type { PrismaClient } from "@job-tracker/db/prisma";

const MOBILE_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function createMobileToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashMobileToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Creates a mobile session and returns its bearer token. */
export async function createMobileSession(
  prisma: PrismaClient,
  userId: string,
) {
  const token = createMobileToken();

  await prisma.mobileSession.create({
    data: {
      tokenHash: hashMobileToken(token),
      userId,
      expiresAt: new Date(Date.now() + MOBILE_SESSION_TTL_MS),
    },
  });

  return token;
}
