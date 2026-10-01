import crypto from "node:crypto";

/*
 * Short-lived, stateless auth code for the browser-based mobile login.
 *
 * The app sends `challenge = sha256(verifier)` when it opens the browser and
 * keeps `verifier` to itself (PKCE-style). After the Google login, the web
 * app redirects back with a signed code bound to that challenge, so a code
 * intercepted from the redirect URL is useless without the verifier.
 */

const CODE_TTL_MS = 2 * 60 * 1000;

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  return secret;
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createMobileAuthCode(userId: string, challenge: string) {
  const payload = Buffer.from(
    JSON.stringify({ userId, challenge, exp: Date.now() + CODE_TTL_MS }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

/** Returns the user ID if the code is valid for this verifier, else `null`. */
export function verifyMobileAuthCode(code: string, verifier: string) {
  const [payload, signature] = code.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);

  if (
    expected.length !== actual.length ||
    !crypto.timingSafeEqual(expected, actual)
  ) {
    return null;
  }

  const { userId, challenge, exp } = JSON.parse(
    Buffer.from(payload, "base64url").toString(),
  ) as { userId: string; challenge: string; exp: number };

  const verifierHash = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("hex");

  if (exp < Date.now() || verifierHash !== challenge) {
    return null;
  }

  return userId;
}
