import { OAuth2Client } from "google-auth-library";

// The mobile app requests ID tokens for the *web* OAuth client
// (GoogleSignin `webClientId`), so their `aud` is the web client ID —
// the same one NextAuth uses.
const webClientId = process.env.GOOGLE_WEB_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;

const googleClient = new OAuth2Client(webClientId);

export async function verifyGoogleIdToken(idToken: string) {
  if (!webClientId) {
    throw new Error("AUTH_GOOGLE_ID is not configured");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: webClientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub) {
    throw new Error("Invalid Google ID token");
  }

  if (!payload.email) {
    throw new Error("Google account has no email");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? null,
    image: payload.picture ?? null,
    emailVerified: payload.email_verified === true,
  };
}
