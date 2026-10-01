import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // If user is already logged in, redirect them directly to the dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Job Tracker</h1>
      <p className="mb-8 text-muted-foreground">
        Track your job applications and interviews in one place.
      </p>

      {/* Sign-in form using NextAuth Server Actions */}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Sign in with Google
        </button>
      </form>
    </main>
  );
}
