"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProject, getAgents, getTasks, getApprovals } from "@/lib/api";
import { ProjectDetail } from "./ProjectDetail";
import { PHASE_LABELS } from "@/lib/demo-data";

export function ProjectDetailDemoClient({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Awaited<
    ReturnType<typeof getProject>
  > | null>(null);
  const [agents, setAgents] = useState<Awaited<ReturnType<typeof getAgents>>>(
    [],
  );
  const [approvals, setApprovals] = useState<
    Awaited<ReturnType<typeof getApprovals>>
  >([]);
  const [tasks, setTasks] = useState<Awaited<ReturnType<typeof getTasks>>>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      getProject(userId, projectId),
      getAgents(userId, projectId),
      getTasks(userId, projectId),
      getApprovals(userId, projectId),
    ])
      .then(([p, a, t, app]) => {
        setProject(p);
        setAgents(a);
        setTasks(t);
        setApprovals(app);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [userId, projectId]);

  useEffect(() => {
    const onFocus = () => {
      getProject(userId, projectId)
        .then(setProject)
        .catch(() => setNotFound(true));
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [userId, projectId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-teal">
        <span className="h-4 w-4 animate-pulse rounded-full bg-pink" />
        Loading project…
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/5 p-6 text-center">
        <p className="text-white">Project not found.</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-3 text-sm text-light-purple hover:underline"
        >
          Back to Factory
        </button>
      </div>
    );
  }

  const refetch = (updatedProject?: Awaited<ReturnType<typeof getProject>>) => {
    if (updatedProject) {
      setProject(updatedProject);
      // Still refetch agents so Approved badge and list stay in sync
      Promise.all([
        getAgents(userId, projectId),
        getTasks(userId, projectId),
        getApprovals(userId, projectId),
      ]).then(([a, t, app]) => {
        setAgents(a);
        setTasks(t);
        setApprovals(app);
      });
      return;
    }
    Promise.all([
      getProject(userId, projectId),
      getAgents(userId, projectId),
      getTasks(userId, projectId),
      getApprovals(userId, projectId),
    ]).then(([p, a, t, app]) => {
      setProject(p);
      setAgents(a);
      setTasks(t);
      setApprovals(app);
    });
  };

  return (
    <ProjectDetail
      project={project}
      agents={agents}
      approvals={approvals}
      tasks={tasks}
      phaseLabels={PHASE_LABELS}
      userId={userId}
      onProjectUpdate={refetch}
      showPreviewOnlyAtEnd
    />
  );
}
