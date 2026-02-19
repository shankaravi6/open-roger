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

const useBackend = () =>
  process.env.NEXT_PUBLIC_DEMO_MODE !== "true" &&
  Boolean(process.env.NEXT_PUBLIC_API_URL);

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!useBackend()) {
    return <ProjectDetailDemoClient userId="demo-user" projectId={id} />;
  }

  const userId = "demo-user";
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
