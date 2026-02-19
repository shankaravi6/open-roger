import { spawn, ChildProcess } from "child_process";
import path from "path";
import fs from "fs/promises";
import { PROJECTS_ROOT } from "../config.js";

const PREVIEW_PORT_START = 4100;
const usedPorts = new Set<number>();
const projectProcesses = new Map<
  string,
  { process: ChildProcess; port: number }
>();

function nextPort(): number {
  let p = PREVIEW_PORT_START;
  while (usedPorts.has(p)) p++;
  usedPorts.add(p);
  return p;
}

export function getPreviewUrl(projectId: string): string | null {
  const entry = projectProcesses.get(projectId);
  return entry ? `http://localhost:${entry.port}` : null;
}

export async function startPreview(
  projectId: string,
): Promise<{ url: string; port: number }> {
  if (projectProcesses.has(projectId)) {
    const url = getPreviewUrl(projectId)!;
    return { url, port: projectProcesses.get(projectId)!.port };
  }
  const frontendPath = path.join(PROJECTS_ROOT, projectId, "frontend");
  try {
    await fs.access(path.join(frontendPath, "package.json"));
  } catch {
    throw new Error(
      "Frontend not found. Run Frontend Development phase first.",
    );
  }
  const port = nextPort();
  const child = spawn("npm", ["run", "dev", "--", "-p", String(port)], {
    cwd: frontendPath,
    shell: true,
    stdio: "ignore",
  });
  child.on("error", () => {});
  child.on("exit", () => {
    projectProcesses.delete(projectId);
    usedPorts.delete(port);
  });
  projectProcesses.set(projectId, { process: child, port });
  await new Promise((r) => setTimeout(r, 3000));
  return { url: `http://localhost:${port}`, port };
}

export function stopPreview(projectId: string): void {
  const entry = projectProcesses.get(projectId);
  if (entry) {
    entry.process.kill();
    projectProcesses.delete(projectId);
    usedPorts.delete(entry.port);
  }
}
