import { prisma, type PrismaClient } from "@job-tracker/db/prisma";
import { hashMobileToken } from "./auth/mobile-session";

export type UserSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export type Context = {
  prisma: PrismaClient;
  session: UserSession | null;
  /** Set when the request was authenticated with a mobile bearer token. */
  mobileSessionId: string | null;
};

export async function createContext({
  req,
  webSession,
}: {
  req: Request;
  webSession?: UserSession | null;
}): Promise<Context> {
  // Web session supplied by the web application (NextAuth cookie)
  if (webSession?.user?.id) {
    return {
      prisma,
      session: webSession,
      mobileSessionId: null,
    };
  }

  // Mobile session
  const authorization = req.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice("Bearer ".length);
    const tokenHash = hashMobileToken(token);

    const mobileSession = await prisma.mobileSession.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (mobileSession && mobileSession.expiresAt > new Date()) {
      const { user } = mobileSession;

      return {
        prisma,
        session: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          },
        },
        mobileSessionId: mobileSession.id,
      };
    }
  }

  return {
    prisma,
    session: null,
    mobileSessionId: null,
  };
}
