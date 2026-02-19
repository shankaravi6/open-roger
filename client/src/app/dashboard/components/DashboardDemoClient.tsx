"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderOpen, ArrowRight, Trash2, Loader2 } from "lucide-react";
import { getProjects, deleteProject } from "@/lib/api";
import { CreateProjectForm } from "./CreateProjectForm";

type ProjectItem = {
  _id: string;
  name: string;
  prompt: string;
  currentPhase: string;
  status: string;
  createdAt: string;
};

export function DashboardDemoClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getProjects(userId)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [userId]);

  // Refresh list after creating a project (CreateProjectForm navigates away; when user comes back we re-run effect)
  useEffect(() => {
    const onFocus = () => getProjects(userId).then(setProjects);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [userId]);

  async function handleDelete(e: React.MouseEvent, projectId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(projectId);
    try {
      await deleteProject(userId, projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Factory</h1>
        <p className="mt-1 text-muted-teal">
          Create and evolve real applications with AI agents. Every step
          requires your approval.{" "}
          <span className="text-pink">(Demo mode – no backend)</span>
        </p>
      </div>

      <CreateProjectForm />

      <div>
        <h2 className="text-lg font-semibold text-white">Your projects</h2>
        {loading ? (
          <p className="mt-2 text-sm text-muted-teal">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="mt-2 text-sm text-muted-teal">
            No projects yet. Create one above.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {projects.map((p) => (
              <li key={p._id}>
                <div className="liquid-glass flex items-center justify-between gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-white/10">
                  <Link
                    href={`/dashboard/projects/${p._id}`}
                    className="flex min-w-0 flex-1 items-center justify-between"
                  >
                    <span className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 shrink-0 text-pink" />
                      <div className="min-w-0">
                        <span className="font-medium text-white">{p.name}</span>
                        <p className="text-xs text-muted-teal">
                          {p.prompt.slice(0, 60)}
                          {p.prompt.length > 60 ? "…" : ""}
                        </p>
                      </div>
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize text-muted-teal">
                        {p.currentPhase.replace(/_/g, " ")}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-teal" />
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, p._id)}
                    disabled={deletingId === p._id}
                    className="shrink-0 rounded-lg p-2 text-muted-teal transition-colors hover:bg-error/20 hover:text-error disabled:opacity-50"
                    title="Delete project"
                    aria-label="Delete project"
                  >
                    {deletingId === p._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
