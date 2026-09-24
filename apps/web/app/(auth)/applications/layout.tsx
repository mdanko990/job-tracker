export default async function RootLayout({
  children,
}: LayoutProps<"/applications">) {
  return <div className="p-4">{children}</div>;
}
