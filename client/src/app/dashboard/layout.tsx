import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "./components/DashboardShell";

const isDemo = () =>
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  !process.env.CLERK_SECRET_KEY;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isDemo()) {
    try {
      const { userId } = await auth();
      if (!userId) redirect("/sign-in");
    } catch {
      redirect("/sign-in");
    }
  }

  return <DashboardShell>{children}</DashboardShell>;
}
