import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FolderOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getProjects } from "@/lib/api";
import { CreateProjectForm } from "./components/CreateProjectForm";
import { DashboardDemoClient } from "./components/DashboardDemoClient";

const isDemo = () =>
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default async function DashboardPage() {
  if (isDemo()) {
    return <DashboardDemoClient userId="demo-user" />;
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let projects: {
    _id: string;
    name: string;
    prompt: string;
    currentPhase: string;
    status: string;
    createdAt: string;
  }[] = [];
  try {
    projects = await getProjects(userId);
  } catch {
    projects = [];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Factory</h1>
        <p className="mt-1 text-muted-teal">
          Create and evolve real applications with AI agents. Every step
          requires your approval.
        </p>
      </div>

      <CreateProjectForm />

      <div>
        <h2 className="text-lg font-semibold text-white">Your projects</h2>
        {projects.length === 0 ? (
          <p className="mt-2 text-sm text-muted-teal">
            No projects yet. Create one above.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {projects.map((p) => (
              <li key={p._id}>
                <Link
                  href={`/dashboard/projects/${p._id}`}
                  className="liquid-glass flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5text-pink" />
                    <div>
                      <span className="font-medium text-white">{p.name}</span>
                      <p className="text-xs text-muted-teal">
                        {p.prompt.slice(0, 60)}…
                      </p>
                    </div>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize text-muted-teal">
                      {p.currentPhase.replace(/_/g, " ")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-teal" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
