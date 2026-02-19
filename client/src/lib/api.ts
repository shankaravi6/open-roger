/**
 * Open Roger API client.
 * When NEXT_PUBLIC_DEMO_MODE=true, uses in-memory/localStorage demo (no backend).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1001";

function isDemo(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    !process.env.NEXT_PUBLIC_API_URL
  );
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

export async function api(
  path: string,
  options: RequestInit & { userId?: string } = {},
): Promise<Response> {
  const { userId, ...rest } = options;
  const headers = new Headers(rest.headers as HeadersInit);
  if (userId) headers.set("x-user-id", userId);
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  return fetch(`${API_URL}${path}`, { ...rest, headers });
}

// Demo store and data (dynamic import to avoid SSR issues with localStorage)
async function getDemoStore() {
  const {
    demoGetProjects,
    demoCreateProject,
    demoGetProject,
    demoApprovePhase,
    demoApproveCustomAgent,
    demoAddAgent,
    demoDeleteProject,
    demoPerformRequest,
  } = await import("./demo-store");
  return {
    demoGetProjects,
    demoCreateProject,
    demoGetProject,
    demoApprovePhase,
    demoApproveCustomAgent,
    demoAddAgent,
    demoDeleteProject,
    demoPerformRequest,
  };
}

export async function getProjects(userId: string) {
  if (isDemo()) {
    if (isClient()) {
      const { demoGetProjects } = await getDemoStore();
      return demoGetProjects(userId);
    }
    return [];
  }
  const res = await api("/api/projects", { userId });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createProject(
  userId: string,
  prompt: string,
  name?: string,
) {
  if (isDemo() && isClient()) {
    const { demoCreateProject } = await getDemoStore();
    return demoCreateProject(userId, prompt, name);
  }
  const res = await api("/api/projects", {
    method: "POST",
    userId,
    body: JSON.stringify({ prompt, name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getProject(userId: string, id: string) {
  if (isDemo() && isClient()) {
    const { demoGetProject } = await getDemoStore();
    const p = demoGetProject(userId, id);
    if (!p) throw new Error("Project not found");
    return p;
  }
  const res = await api(`/api/projects/${id}`, { userId });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteProject(userId: string, projectId: string) {
  if (isDemo() && isClient()) {
    const { demoDeleteProject } = await getDemoStore();
    const ok = demoDeleteProject(userId, projectId);
    if (!ok) throw new Error("Project not found");
    return {};
  }
  const res = await api(`/api/projects/${projectId}`, {
    method: "DELETE",
    userId,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function performRequest(
  userId: string,
  projectId: string,
  request: string,
) {
  if (isDemo() && isClient()) {
    const { demoPerformRequest } = await getDemoStore();
    const project = demoPerformRequest(userId, projectId, request);
    if (!project) throw new Error("Project not found");
    return project;
  }
  const res = await api(`/api/projects/${projectId}/request`, {
    method: "POST",
    userId,
    body: JSON.stringify({ request }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function approvePhase(
  userId: string,
  projectId: string,
  action: string,
  comment?: string,
) {
  if (isDemo() && isClient()) {
    const { demoApprovePhase } = await getDemoStore();
    demoApprovePhase(userId, projectId, action, comment);
    const { demoGetProject } = await getDemoStore();
    return demoGetProject(userId, projectId);
  }
  const res = await api(`/api/projects/${projectId}/approve`, {
    method: "POST",
    userId,
    body: JSON.stringify({ action, comment }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function approveCustomAgent(
  userId: string,
  projectId: string,
  agentId: string,
) {
  if (isDemo() && isClient()) {
    const { demoApproveCustomAgent } = await getDemoStore();
    demoApproveCustomAgent(userId, projectId, agentId);
    const { demoGetProject } = await getDemoStore();
    return demoGetProject(userId, projectId);
  }
  const res = await api(`/api/projects/${projectId}/agents/${agentId}/approve`, {
    method: "POST",
    userId,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAgents(userId: string, projectId: string) {
  if (isDemo() && isClient()) {
    const { demoGetProject } = await getDemoStore();
    const p = demoGetProject(userId, projectId);
    if (!p) return [];
    const { DEFAULT_AGENTS } = await import("./demo-data");
    return [...DEFAULT_AGENTS, ...p.customAgents];
  }
  const res = await api(`/api/agents/project/${projectId}`, { userId });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addAgent(
  userId: string,
  projectId: string,
  body: { name: string; role: string; allowedFolders?: string[] },
) {
  if (isDemo() && isClient()) {
    const { demoAddAgent } = await getDemoStore();
    demoAddAgent(userId, projectId, body);
    const { demoGetProject } = await getDemoStore();
    const p = demoGetProject(userId, projectId);
    return p?.customAgents[p.customAgents.length - 1] ?? body;
  }
  const res = await api(`/api/agents/project/${projectId}`, {
    method: "POST",
    userId,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getTasks(userId: string, projectId: string) {
  if (isDemo() && isClient()) {
    const { demoGetProject } = await getDemoStore();
    const p = demoGetProject(userId, projectId);
    if (!p) return [];
    const { getTasksForPhase } = await import("./demo-data");
    return getTasksForPhase(projectId, p.currentPhase);
  }
  const res = await api(`/api/tasks/project/${projectId}`, { userId });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getApprovals(userId: string, projectId: string) {
  if (isDemo() && isClient()) {
    const { demoGetProject } = await getDemoStore();
    const p = demoGetProject(userId, projectId);
    return p?.approvals ?? [];
  }
  const res = await api(`/api/tasks/project/${projectId}/approvals`, {
    userId,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getFile(
  userId: string,
  projectId: string,
  filePath: string,
) {
  if (isDemo() && isClient()) {
    const { getDemoFileContent } = await import("./demo-data");
    return { content: getDemoFileContent(filePath) ?? "" };
  }
  const res = await api(
    `/api/projects/${projectId}/file?path=${encodeURIComponent(filePath)}`,
    { userId },
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getPreviewUrl(userId: string, projectId: string) {
  if (isDemo() && isClient()) {
    return { url: `/preview/${projectId}` };
  }
  const res = await api(`/api/projects/${projectId}/preview-url`, { userId });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function startPreview(userId: string, projectId: string) {
  if (isDemo() && isClient()) {
    return { url: `/preview/${projectId}` };
  }
  const res = await api(`/api/projects/${projectId}/preview-start`, {
    method: "POST",
    userId,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
