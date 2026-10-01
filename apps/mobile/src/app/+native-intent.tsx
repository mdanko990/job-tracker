// The browser login returns to `…/--/auth?code=…` (Expo Go) or
// `mobile://auth?code=…`. That link is consumed by `openAuthSessionAsync` in
// `signInWithBrowser`, so the router must not navigate anywhere for it.
const LOGIN_CALLBACK = /^\/*auth([?#/]|$)/;

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const route = path.includes("/--/")
      ? path.slice(path.indexOf("/--/") + 3)
      : path.replace(/^[a-z][\w+.-]*:\/\//i, "/");

    return LOGIN_CALLBACK.test(route) ? null : path;
  } catch {
    return path;
  }
}
