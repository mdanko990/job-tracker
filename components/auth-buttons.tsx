"use client";

import { handleSignIn, handleSignOut } from "@/lib/auth/actions";

export function SignInButton() {
  return (
    <form action={handleSignIn}>
      <button type="submit">Sign in with Google</button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded-sm"
    >
      Sign Out
    </button>
  );
}
