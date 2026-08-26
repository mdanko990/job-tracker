import { NavigationBar } from "@/components/navigation-bar";
import { auth } from "@/lib/auth";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col p-4">
      <NavigationBar user={session?.user} />
      {children}
    </main>
  );
}
