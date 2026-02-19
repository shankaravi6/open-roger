/**
 * In-memory + localStorage persistence for demo mode (no backend).
 * Projects are keyed by userId so each user sees their own demo projects.
 */

import {
  createDemoProject,
  getFolderStructureForPhase,
  getTasksForPhase,
  PHASES,
} from "./demo-data";

type StoredProject = ReturnType<typeof createDemoProject>;

const KEY_PREFIX = "open-roger-demo-projects-";

function storageKey(userId: string): string {
  return `${KEY_PREFIX}${userId}`;
}

function getStored(userId: string): StoredProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStored(userId: string, projects: StoredProject[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(projects));
  } catch {
    // ignore
  }
}

export function demoGetProjects(userId: string): Array<{
  _id: string;
  name: string;
  prompt: string;
  currentPhase: string;
  status: string;
  createdAt: string;
}> {
  const list = getStored(userId);
  return list.map((p) => ({
    _id: p._id,
    name: p.name,
    prompt: p.prompt,
    currentPhase: p.currentPhase,
    status: p.status,
    createdAt: p.createdAt,
  }));
}

export function demoCreateProject(
  userId: string,
  prompt: string,
  name?: string,
): StoredProject {
  const project = createDemoProject(prompt, name);
  const list = getStored(userId);
  list.unshift(project);
  setStored(userId, list);
  return project;
}

export function demoGetProject(
  userId: string,
  id: string,
): StoredProject | null {
  const list = getStored(userId);
  return list.find((p) => p._id === id) ?? null;
}

export function demoApprovePhase(
  userId: string,
  projectId: string,
  action: string,
  comment?: string,
): void {
  const list = getStored(userId);
  const project = list.find((p) => p._id === projectId);
  if (!project) return;
  project.approvals.push({
    phase: project.currentPhase,
    action,
    comment,
    createdAt: new Date().toISOString(),
  });
  if (action === "approved") {
    const idx = PHASES.indexOf(project.currentPhase as (typeof PHASES)[number]);
    if (idx >= 0 && idx < PHASES.length - 1) {
      project.currentPhase = PHASES[idx + 1];
      project.folderStructure = getFolderStructureForPhase(
        project.currentPhase,
      );
    }
  }
  if (action === "rejected") {
    project.status = "rejected";
  }
  setStored(userId, list);
}

export function demoAddAgent(
  userId: string,
  projectId: string,
  body: { name: string; role: string; allowedFolders?: string[] },
): void {
  const list = getStored(userId);
  const project = list.find((p) => p._id === projectId);
  if (!project) return;
  project.customAgents.push({
    _id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: body.name,
    role: body.role,
    allowedFolders: body.allowedFolders,
    approved: false,
  });
  setStored(userId, list);
}

export function demoDeleteProject(userId: string, projectId: string): boolean {
  const list = getStored(userId).filter((p) => p._id !== projectId);
  if (list.length === getStored(userId).length) return false;
  setStored(userId, list);
  return true;
}

/**
 * Perform a follow-up request via "Request changes" — only updates preview variant.
 * Dark theme and glassmorphism are separate: use "dark theme" or "glassmorphism" in the request.
 */
export function demoPerformRequest(
  userId: string,
  projectId: string,
  request: string,
): StoredProject | null {
  const list = getStored(userId);
  const project = list.find((p) => p._id === projectId);
  if (!project) return null;
  const r = request.toLowerCase().trim();
  // Dark theme only (Request changes)
  if (r.includes("dark") || r.includes("dark theme")) {
    project.previewVariant = "dark";
    setStored(userId, list);
    return project;
  }
  // Glassmorphism only (Request changes) — separate from dark
  if (r.includes("glassmorphism")) {
    project.previewVariant = "glassmorphism";
    setStored(userId, list);
    return project;
  }
  setStored(userId, list);
  return project;
}

/**
 * Approve a custom agent (from Phase workflow). Marks agent approved and, if the agent
 * is a Glassmorphism UI agent, updates live preview to glassmorphism variant.
 */
export function demoApproveCustomAgent(
  userId: string,
  projectId: string,
  agentId: string,
): void {
  const list = getStored(userId);
  const project = list.find((p) => p._id === projectId);
  if (!project) return;
  const agent = project.customAgents.find((a) => a._id === agentId);
  if (!agent) return;
  agent.approved = true;
  const nameOrRole = `${agent.name} ${agent.role}`.toLowerCase();
  if (nameOrRole.includes("glassmorphism")) {
    project.previewVariant = "glassmorphism";
  }
  setStored(userId, list);
}
