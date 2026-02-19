"use client";

import { useRouter } from "next/navigation";
import {
  Check,
  X,
  MessageSquare,
  FolderOpen,
  FileText,
  Loader2,
  Bot,
  Monitor,
  Play,
  Plus,
  XCircle,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import {
  approvePhase,
  approveCustomAgent,
  getPreviewUrl,
  startPreview,
  getFile,
  addAgent,
  deleteProject,
  performRequest,
} from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PHASE_DELIVERABLE } from "@/lib/demo-data";

type Project = {
  _id: string;
  name: string;
  prompt: string;
  currentPhase: string;
  status: string;
  folderStructure?: Record<string, unknown>;
  createdAt: string;
  previewVariant?: string;
};

type Agent = {
  _id: string;
  name: string;
  role: string;
  isDefault?: boolean;
  allowedFolders?: string[];
  approved?: boolean;
};

type Approval = {
  phase: string;
  action: string;
  comment?: string;
  createdAt: string;
};

type Task = {
  _id: string;
  phase: string;
  title?: string;
  output?: string;
  status: string;
  agentId?: { name: string; role: string };
  createdAt: string;
};

export function ProjectDetail({
  project,
  agents,
  approvals,
  tasks,
  phaseLabels,
  userId,
  onProjectUpdate,
  alwaysShowPreview,
  showPreviewOnlyAtEnd,
}: {
  project: Project;
  agents: Agent[];
  approvals: Approval[];
  tasks: Task[];
  phaseLabels: Record<string, string>;
  userId: string;
  /** When provided (e.g. demo mode), called after approval so parent can refetch. Pass updated project to set UI immediately (e.g. previewVariant). */
  onProjectUpdate?: (updatedProject?: Project) => void;
  /** When true (e.g. demo), show preview section and load preview URL even without frontend folder. */
  alwaysShowPreview?: boolean;
  /** When true, show live preview only in the final (review) phase. */
  showPreviewOnlyAtEnd?: boolean;
}) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(
    null,
  );
  const [fileLoading, setFileLoading] = useState(false);
  const [addAgentOpen, setAddAgentOpen] = useState(false);
  const [addAgentLoading, setAddAgentLoading] = useState(false);
  const [addAgentName, setAddAgentName] = useState("");
  const [addAgentRole, setAddAgentRole] = useState("");
  const [addAgentFolders, setAddAgentFolders] = useState("");
  const [addAgentError, setAddAgentError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [requestText, setRequestText] = useState("");
  const [performLoading, setPerformLoading] = useState(false);
  const [performError, setPerformError] = useState<string | null>(null);
  const [lastAddedAgentId, setLastAddedAgentId] = useState<string | null>(null);
  const [approveAgentLoading, setApproveAgentLoading] = useState<string | null>(
    null,
  );
  const agentsListRef = useRef<HTMLUListElement>(null);

  const hasFrontend =
    project.folderStructure &&
    typeof project.folderStructure.frontend === "object" &&
    project.folderStructure.frontend !== null &&
    Object.keys(project.folderStructure.frontend as object).length > 0;

  const showPreview =
    (hasFrontend || alwaysShowPreview) &&
    (!showPreviewOnlyAtEnd || project.currentPhase === "review_refinement");

  useEffect(() => {
    if (!showPreview) return;
    getPreviewUrl(userId, project._id)
      .then(
        (data: { url: string | null }) => data.url && setPreviewUrl(data.url),
      )
      .catch(() => {});
  }, [userId, project._id, showPreview]);

  async function handleStartPreview() {
    setPreviewLoading(true);
    try {
      const data = await startPreview(userId, project._id);
      if (data.url) setPreviewUrl(data.url);
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleApprove(action: string) {
    setActionLoading(action);
    try {
      await approvePhase(userId, project._id, action, comment || undefined);
      onProjectUpdate?.();
      router.refresh();
    } finally {
      setActionLoading(null);
      setComment("");
    }
  }

  async function handleFileClick(filePath: string) {
    setSelectedFilePath(filePath);
    setFileLoading(true);
    setSelectedFileContent(null);
    try {
      const data = await getFile(userId, project._id, filePath);
      setSelectedFileContent((data as { content: string }).content ?? null);
    } catch {
      setSelectedFileContent(null);
    } finally {
      setFileLoading(false);
    }
  }

  async function handleAddAgent(e: React.FormEvent) {
    e.preventDefault();
    if (!addAgentName.trim() || !addAgentRole.trim()) return;
    setAddAgentLoading(true);
    setAddAgentError(null);
    try {
      const allowedFolders = addAgentFolders
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const newAgent = await addAgent(userId, project._id, {
        name: addAgentName.trim(),
        role: addAgentRole.trim(),
        allowedFolders: allowedFolders.length ? allowedFolders : undefined,
      });
      const addedId = (newAgent as { _id?: string })._id;
      setAddAgentName("");
      setAddAgentRole("");
      setAddAgentFolders("");
      setAddAgentOpen(false);
      if (addedId) setLastAddedAgentId(addedId);
      onProjectUpdate?.();
      router.refresh();
    } catch (err) {
      setAddAgentError(
        err instanceof Error ? err.message : "Failed to add agent",
      );
    } finally {
      setAddAgentLoading(false);
    }
  }

  // Auto-scroll to newly added agent after list updates
  useEffect(() => {
    if (!lastAddedAgentId || !agents.some((a) => a._id === lastAddedAgentId))
      return;
    const el = agentsListRef.current?.querySelector(
      `[data-agent-id="${lastAddedAgentId}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    setLastAddedAgentId(null);
  }, [agents, lastAddedAgentId]);

  async function handleApproveAgent(agentId: string) {
    setApproveAgentLoading(agentId);
    try {
      const updatedProject = await approveCustomAgent(
        userId,
        project._id,
        agentId,
      );
      // Pass updated project so parent sets it immediately (keeps previewVariant e.g. glassmorphism)
      if (updatedProject) {
        onProjectUpdate?.(updatedProject as Project);
      } else {
        onProjectUpdate?.();
      }
      router.refresh();
    } finally {
      setApproveAgentLoading(null);
    }
  }

  const phases = Object.keys(phaseLabels);
  const currentIndex = phases.indexOf(project.currentPhase);

  function renderTree(
    obj: Record<string, unknown>,
    prefix = "",
  ): React.ReactNode {
    return Object.entries(obj).map(([key, value]) => {
      const fullPath = prefix ? `${prefix}${key}` : key;
      if (value === "file") {
        return (
          <button
            type="button"
            key={fullPath}
            onClick={() => handleFileClick(fullPath)}
            className="flex w-full items-center gap-2 py-0.5 pl-4 text-left text-sm text-muted-teal transition-colors hover:bg-white/10 hover:text-white"
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-pink" />
            {key}
          </button>
        );
      }
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return (
          <div key={fullPath} className="py-0.5">
            <div className="flex items-center gap-2 text-sm text-white">
              <FolderOpen className="h-4 w-4 text-pink" />
              {key}/
            </div>
            <div className="pl-4">
              {renderTree(value as Record<string, unknown>, `${prefix}${key}/`)}
            </div>
          </div>
        );
      }
      return null;
    });
  }

  const structure = project.folderStructure || {
    frontend: {},
    backend: {},
  };

  async function handleDelete() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      await deleteProject(userId, project._id);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setDeleteError("Failed to delete project");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handlePerformRequest() {
    if (!requestText.trim()) return;
    setPerformError(null);
    setPerformLoading(true);
    try {
      await performRequest(userId, project._id, requestText.trim());
      setRequestText("");
      onProjectUpdate?.();
      router.refresh();
    } catch {
      setPerformError("Failed to perform request");
    } finally {
      setPerformLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-teal">
        <Link href="/dashboard" className="hover:text-white">
          Factory
        </Link>
        <span>/</span>
        <span className="text-white">{project.name}</span>
      </div>

      <div className="liquid-glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">{project.name}</h1>
            <p className="mt-1 text-sm text-muted-teal">{project.prompt}</p>
            <p className="mt-2 text-xs text-muted-teal">
              Status:{" "}
              <span className="capitalize text-white">{project.status}</span>
              {" · "}
              Current phase:{" "}
              <span className="capitalize text-pink">
                {phaseLabels[project.currentPhase] || project.currentPhase}
              </span>
            </p>
          </div>
          <div>
            {deleteError && (
              <p className="mb-2 text-sm text-error">{deleteError}</p>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-muted-teal transition-colors hover:bg-error/20 hover:border-error/50 hover:text-error disabled:opacity-50"
              title="Delete project"
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Current phase deliverable: Architecture → Database → Backend → Frontend → Review (one by one) */}
      {(() => {
        const deliverable = PHASE_DELIVERABLE[project.currentPhase];
        if (!deliverable) return null;
        return (
          <div className="liquid-glass-card rounded-2xl border-pink/30 p-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
              <LayoutDashboard className="h-5 w-5 text-pink" />
              {deliverable.title} · {deliverable.agent}
            </h2>
            <ul className="space-y-1.5 text-sm text-muted-teal">
              {deliverable.content.map((line, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-pink" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="liquid-glass-card rounded-2xl p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <FolderOpen className="h-5 w-5 text-pink" />
            Folder structure (live)
          </h2>
          <p className="mb-2 text-xs text-muted-teal">
            Click a file to view generated code (req §7).
          </p>
          <div className="max-h-64 overflow-auto rounded-lg bg-black/20 p-3 font-mono text-sm">
            {Object.keys(structure).length === 0 ? (
              <p className="text-muted-teal">Empty workspace</p>
            ) : (
              renderTree(structure as Record<string, unknown>)
            )}
          </div>
          {selectedFilePath && (
            <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs text-muted-teal">
                  {selectedFilePath}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilePath(null);
                    setSelectedFileContent(null);
                  }}
                  className="rounded p-1 text-muted-teal hover:bg-white/10 hover:text-white"
                  aria-label="Close file"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-48 overflow-auto rounded bg-black/40 p-2 font-mono text-xs text-white">
                {fileLoading ? (
                  <div className="flex items-center gap-2 text-muted-teal">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </div>
                ) : selectedFileContent !== null ? (
                  <pre className="whitespace-pre-wrap break-words">
                    {selectedFileContent}
                  </pre>
                ) : (
                  <span className="text-muted-teal">Could not load file.</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="liquid-glass-card rounded-2xl p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Bot className="h-5 w-5 text-pink" />
            Agents
          </h2>
          <ul ref={agentsListRef} className="space-y-2">
            {agents.map((a) => (
              <li
                key={a._id}
                data-agent-id={a._id}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
              >
                <span className="font-medium text-white">{a.name}</span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-muted-teal">
                  {a.role}
                  {a.allowedFolders?.length
                    ? ` (${a.allowedFolders.join(", ")})`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-teal">
            Add custom agents with strict scope (req §5).
          </p>
          {!addAgentOpen ? (
            <button
              type="button"
              onClick={() => setAddAgentOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4" />
              Add agent
            </button>
          ) : (
            <form onSubmit={handleAddAgent} className="mt-3 space-y-2">
              <input
                type="text"
                value={addAgentName}
                onChange={(e) => setAddAgentName(e.target.value)}
                placeholder="Name (e.g. Security Review)"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-teal"
                required
              />
              <input
                type="text"
                value={addAgentRole}
                onChange={(e) => setAddAgentRole(e.target.value)}
                placeholder="Role (e.g. security)"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-teal"
                required
              />
              <input
                type="text"
                value={addAgentFolders}
                onChange={(e) => setAddAgentFolders(e.target.value)}
                placeholder="Allowed folders: frontend, backend, db (comma-separated)"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-teal"
              />
              {addAgentError && (
                <p className="text-sm text-error">{addAgentError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addAgentLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-pink px-3 py-2 text-sm font-medium text-white hover:bg-light-purple disabled:opacity-50"
                >
                  {addAgentLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddAgentOpen(false);
                    setAddAgentError(null);
                  }}
                  className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showPreview && (
        <>
          {/* Request changes: dark theme and glassmorphism are separate */}
          <div className="liquid-glass-card rounded-2xl p-6">
            <h2 className="mb-2 font-semibold text-white">Request changes</h2>
            <p className="mb-3 text-sm text-muted-teal">
              Type &quot;dark theme&quot; and click Perform to update the live
              preview.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <input
                type="text"
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="e.g. Convert dark theme"
                className="min-w-[240px] flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-teal focus:border-pink focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handlePerformRequest()}
              />
              <button
                type="button"
                onClick={handlePerformRequest}
                disabled={performLoading || !requestText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-pink px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {performLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Perform
              </button>
            </div>
            {performError && (
              <p className="mt-2 text-sm text-error">{performError}</p>
            )}
          </div>

          <div className="liquid-glass-card rounded-2xl p-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
              <Monitor className="h-5 w-5 text-pink" />
              Live application preview
            </h2>
            <p className="mb-4 text-sm text-muted-teal">
              All phases complete. View the built app below.
              {project.previewVariant && (
                <span className="ml-1 text-pink">
                  (Variant: {project.previewVariant})
                </span>
              )}
            </p>
            {!previewUrl ? (
              <button
                onClick={handleStartPreview}
                disabled={previewLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-pink px-4 py-2 text-sm font-medium text-white hover:bg-light-purple disabled:opacity-50"
              >
                {previewLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Start preview
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-teal">
                  App running at {previewUrl}
                  {project.previewVariant ? `?v=${project.previewVariant}` : ""}
                </p>
                <div className="h-[480px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <iframe
                    key={project.previewVariant ?? "default"}
                    src={`${previewUrl}${project.previewVariant ? `?v=${project.previewVariant}` : ""}`}
                    title="Created app preview"
                    className="h-full w-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="liquid-glass-card rounded-2xl p-6">
        <h2 className="mb-3 font-semibold text-white">Phase workflow</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {phases.map((phase, i) => (
            <span
              key={phase}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                i < currentIndex
                  ? "bg-green-500/20 text-green-400"
                  : i === currentIndex
                    ? "bg-pink/30 text-white"
                    : "bg-white/10 text-muted-teal"
              }`}
            >
              {phaseLabels[phase] || phase}
            </span>
          ))}
        </div>
        <p className="mb-4 text-sm text-muted-teal">
          Nothing advances without your approval. Approve the current phase to
          continue, or reject / request changes.
        </p>
        {(() => {
          const customAgents = agents.filter((a) => !a.isDefault);
          const unapproved = customAgents.filter(
            (a) => !(a as Agent & { approved?: boolean }).approved,
          );
          if (customAgents.length === 0) return null;
          return (
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-medium text-white">
                Custom agents (approve to apply changes in live preview)
              </h3>
              <ul className="space-y-2">
                {customAgents.map((a) => {
                  const approved = (a as Agent & { approved?: boolean })
                    .approved;
                  return (
                    <li
                      key={a._id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-white">{a.name}</span>
                      <span className="text-xs text-muted-teal">{a.role}</span>
                      {approved ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                          <Check className="h-3 w-3" />
                          Approved
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApproveAgent(a._id)}
                          disabled={approveAgentLoading === a._id}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500 disabled:opacity-50"
                        >
                          {approveAgentLoading === a._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Approve
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
              {unapproved.length > 0 && (
                <p className="mt-2 text-xs text-muted-teal">
                  Approving a custom agent (e.g. Glassmorphism UI Agent) updates
                  the live preview.
                </p>
              )}
            </div>
          );
        })()}
        {project.status === "rejected" ? (
          <p className="text-sm text-error">This project was rejected.</p>
        ) : project.currentPhase === "review_refinement" ? (
          <p className="text-sm text-muted-teal">
            Final phase. No further approvals.
          </p>
        ) : (
          <>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment (e.g. for changes requested)"
              rows={2}
              className="mb-3 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-teal focus:border-pink focus:outline-none"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleApprove("approved")}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
              >
                {actionLoading === "approved" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Approve
              </button>
              <button
                onClick={() => handleApprove("rejected")}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-error px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {actionLoading === "rejected" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Reject
              </button>
              <button
                onClick={() => handleApprove("changes_requested")}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50"
              >
                {actionLoading === "changes_requested" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                Request changes
              </button>
            </div>
          </>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="liquid-glass-card rounded-2xl p-6">
          <h2 className="mb-3 font-semibold text-white">
            Phase outputs (agent tasks)
          </h2>
          <p className="mb-3 text-xs text-muted-teal">
            Track which agent ran and what was produced (req §7).
          </p>
          <ul className="space-y-2 text-sm">
            {tasks.slice(0, 15).map((t) => (
              <li
                key={t._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-white">
                  {phaseLabels[t.phase] || t.phase}
                  {t.agentId && (
                    <span className="ml-2 text-muted-teal">
                      — {t.agentId.name}
                    </span>
                  )}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    t.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-muted-teal"
                  }`}
                >
                  {t.status}
                </span>
                {t.output && (
                  <span className="w-full text-xs text-muted-teal">
                    {t.output}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {approvals.length > 0 && (
        <div className="liquid-glass rounded-2xl p-6">
          <h2 className="mb-3 font-semibold text-white">Approval history</h2>
          <ul className="space-y-2 text-sm">
            {approvals.slice(0, 10).map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-muted-teal">
                  {phaseLabels[a.phase] || a.phase}
                </span>
                <span
                  className={`capitalize ${a.action === "approved" ? "text-green-400" : a.action === "rejected" ? "text-error" : "text-yellow-400"}`}
                >
                  {a.action.replace(/_/g, " ")}
                </span>
                {a.comment && (
                  <span className="text-muted-teal">— {a.comment}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
