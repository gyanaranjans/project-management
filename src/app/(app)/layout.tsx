import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { MainNav } from "@/components/MainNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <MainNav />
      {children}
    </>
  );
}
