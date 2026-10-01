import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { API_URL } from "./trpc";

// Closes the auth popup when this bundle is loaded inside it (web only).
WebBrowser.maybeCompleteAuthSession();

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Signs in with Google in the browser (works in Expo Go — no native module).
 *
 * Returns a one-time code plus the PKCE verifier to exchange for a session
 * via `auth.exchangeMobileCode`, or `null` if the user closed the browser.
 */
export async function signInWithBrowser(): Promise<{
  code: string;
  verifier: string;
} | null> {
  const verifier = toHex(Crypto.getRandomBytes(32));
  const challenge = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.HEX },
  );

  // exp://…/--/auth in Expo Go, mobile://auth in a standalone build
  const redirectUrl = Linking.createURL("auth");

  const loginUrl =
    `${API_URL}/api/auth/mobile?` +
    new URLSearchParams({ redirect: redirectUrl, challenge }).toString();

  const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUrl);

  if (result.type !== "success") {
    return null; // cancelled or dismissed
  }

  const code = Linking.parse(result.url).queryParams?.code;

  if (typeof code !== "string") {
    throw new Error("Login did not return a code");
  }

  return { code, verifier };
}
