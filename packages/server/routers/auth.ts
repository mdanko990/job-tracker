import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { publicProcedure, protectedProcedure, router } from "../trpc";

import { verifyGoogleIdToken } from "../auth/google";
import { verifyMobileAuthCode } from "../auth/mobile-code";
import { createMobileSession } from "../auth/mobile-session";

export const authRouter = router({
  /*
   * Browser-based mobile login (works in Expo Go): the app exchanges the
   * code from /api/auth/mobile plus its PKCE verifier for a session token.
   */
  exchangeMobileCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1),
        verifier: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = verifyMobileAuthCode(input.code, input.verifier);

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired login code",
        });
      }

      const token = await createMobileSession(ctx.prisma, userId);

      return { token };
    }),

  googleMobile: publicProcedure
    .input(
      z.object({
        idToken: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let googleUser;

      try {
        googleUser = await verifyGoogleIdToken(input.idToken);
      } catch {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Google ID token",
        });
      }

      /*
       * First find the Google Account.
       *
       * This is the safest way to identify an existing
       * Google user.
       */
      let account = await ctx.prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: googleUser.googleId,
          },
        },
        include: {
          user: true,
        },
      });

      let user;

      if (account) {
        user = account.user;
      } else {
        /*
         * If the Google account doesn't exist yet,
         * check whether this email already belongs to a user.
         */
        user = await ctx.prisma.user.findUnique({
          where: {
            email: googleUser.email,
          },
        });

        if (!user) {
          user = await ctx.prisma.user.create({
            data: {
              email: googleUser.email,
              name: googleUser.name,
              image: googleUser.image,
              emailVerified: googleUser.emailVerified ? new Date() : null,
            },
          });
        }

        /*
         * Connect the Google account to the same User.
         */
        account = await ctx.prisma.account.create({
          data: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId: googleUser.googleId,
          },
          include: {
            user: true,
          },
        });
      }

      /*
       * Create our own mobile session.
       */
      const token = await createMobileSession(ctx.prisma, user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.session.user.id,
      email: ctx.session.user.email,
      name: ctx.session.user.name,
      image: ctx.session.user.image,
    };
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    // Revoke the mobile session the bearer token belongs to.
    if (ctx.mobileSessionId) {
      await ctx.prisma.mobileSession.deleteMany({
        where: { id: ctx.mobileSessionId },
      });
    }

    return {
      success: true,
    };
  }),
});
