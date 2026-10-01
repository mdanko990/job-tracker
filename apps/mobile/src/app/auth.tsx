import { Redirect } from "expo-router";

// Target of the login redirect (…/--/auth?code=…). The code itself is read
// by `signInWithBrowser`; this route only keeps the router from showing
// "Unmatched route" when the deep link arrives.
export default function AuthRedirect() {
  return <Redirect href="/" />;
}
