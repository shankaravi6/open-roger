import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProject, getAgents, getApprovals, getTasks } from "@/lib/api";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectDetailDemoClient } from "./ProjectDetailDemoClient";

const PHASE_LABELS: Record<string, string> = {
  architecture: "Architecture",
  database_design: "Database Design",
  backend_development: "Backend Development",
  frontend_development: "Frontend Development",
  review_refinement: "Review / Refinement",
};

const isDemo = () =>
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  !process.env.NEXT_CLERK_PUBLISHABLE_KEY ||
  !process.env.CLERK_SECRET_KEY;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isDemo()) {
    return <ProjectDetailDemoClient userId="demo-user" projectId={id} />;
  }

  let userId: string | null = null;
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch {
    redirect("/sign-in");
  }
  if (!userId) redirect("/sign-in");

  let project: Awaited<ReturnType<typeof getProject>>;
  let agents: Awaited<ReturnType<typeof getAgents>> = [];
  let approvals: Awaited<ReturnType<typeof getApprovals>> = [];
  let tasks: Awaited<ReturnType<typeof getTasks>> = [];

  try {
    project = await getProject(userId, id);
  } catch {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  try {
    agents = await getAgents(userId, id);
  } catch {}
  try {
    approvals = await getApprovals(userId, id);
  } catch {}
  try {
    tasks = await getTasks(userId, id);
  } catch {}

  return (
    <ProjectDetail
      project={project}
      agents={agents}
      approvals={approvals}
      tasks={tasks}
      phaseLabels={PHASE_LABELS}
      userId={userId}
    />
  );
}
