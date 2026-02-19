import fs from "fs/promises";
import path from "path";
import { PROJECTS_ROOT } from "../config.js";

export async function ensureProjectsRoot(): Promise<void> {
  await fs.mkdir(PROJECTS_ROOT, { recursive: true });
}

/**
 * Create project workspace with mandatory structure per req §10:
 * frontend/ (Next.js), backend/ (Node.js), db/ (MongoDB schema & scripts).
 */
export async function createProjectWorkspace(
  projectId: string,
): Promise<string> {
  await ensureProjectsRoot();
  const projectPath = path.join(PROJECTS_ROOT, projectId);
  await fs.mkdir(projectPath, { recursive: true });
  await fs.mkdir(path.join(projectPath, "frontend"), { recursive: true });
  await fs.mkdir(path.join(projectPath, "backend"), { recursive: true });
  await fs.mkdir(path.join(projectPath, "db"), { recursive: true });
  return projectPath;
}

export async function getFolderStructure(
  projectId: string,
): Promise<Record<string, unknown>> {
  const projectPath = path.join(PROJECTS_ROOT, projectId);
  try {
    const stat = await fs.stat(projectPath);
    if (!stat.isDirectory()) return {};
  } catch {
    return {};
  }

  async function walk(
    dir: string,
    base: string,
  ): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {};
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const rel = path.join(base, entry.name);
      if (entry.isDirectory()) {
        result[entry.name] = await walk(path.join(dir, entry.name), rel);
      } else {
        result[entry.name] = "file";
      }
    }
    return result;
  }

  return walk(projectPath, "");
}

export async function readProjectFile(
  projectId: string,
  filePath: string,
): Promise<string | null> {
  const fullPath = path.join(PROJECTS_ROOT, projectId, filePath);
  const root = path.join(PROJECTS_ROOT, projectId);
  const resolved = path.resolve(fullPath);
  if (!resolved.startsWith(root)) return null;
  try {
    const content = await fs.readFile(resolved, "utf-8");
    return content;
  } catch {
    return null;
  }
}

export async function writeProjectFile(
  projectId: string,
  filePath: string,
  content: string,
): Promise<void> {
  const root = path.join(PROJECTS_ROOT, projectId);
  const fullPath = path.join(root, filePath);
  const resolved = path.resolve(fullPath);
  if (!resolved.startsWith(root)) throw new Error("Invalid path");
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, content, "utf-8");
}
