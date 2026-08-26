// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <h1>Welcome back, {session.user.name}</h1>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}
