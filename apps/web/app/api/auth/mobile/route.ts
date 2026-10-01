import { NextResponse, type NextRequest } from "next/server";
import { createMobileAuthCode } from "@job-tracker/server/auth/mobile-code";
import { auth, signIn } from "@/lib/auth";

// Only redirect back into the app: Expo Go (exp/exps) or the app's own scheme.
const ALLOWED_REDIRECT = /^(exps?|mobile|jobtracker):\/\//;
const SHA256_HEX = /^[a-f0-9]{64}$/;

/*
 * Browser-based login for the mobile app.
 *
 * The app opens this URL in an in-app browser. If the browser has no web
 * session yet, we start the normal NextAuth Google login and come back here
 * afterwards. Then we redirect to the app with a short-lived code, which the
 * app exchanges (with its PKCE verifier) via `auth.exchangeMobileCode`.
 */
export async function GET(request: NextRequest) {
  const redirect = request.nextUrl.searchParams.get("redirect");
  const challenge = request.nextUrl.searchParams.get("challenge");

  if (
    !redirect ||
    !ALLOWED_REDIRECT.test(redirect) ||
    !challenge ||
    !SHA256_HEX.test(challenge)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    // Throws a redirect to Google; NextAuth brings the user back here.
    return signIn("google", {
      redirectTo: `${request.nextUrl.pathname}${request.nextUrl.search}`,
    });
  }

  const target = new URL(redirect);
  target.searchParams.set("code", createMobileAuthCode(userId, challenge));

  return NextResponse.redirect(target.toString());
}
