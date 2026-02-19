import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import { PROJECTS_ROOT } from "../config.js";

const execAsync = promisify(exec);

/** Whitelist: only these commands can run. Agents never run shell; orchestrator does. */
const ALLOWED_COMMANDS = [
  "npx create-next-app@latest",
  "npx create-next-app",
  "npm init -y",
  "npm init",
  "npm install",
  "npm run ",
  "node ",
];

function isAllowed(fullCommand: string): boolean {
  const normalized = fullCommand.trim().toLowerCase();
  return ALLOWED_COMMANDS.some((cmd) =>
    normalized.startsWith(cmd.trim().toLowerCase()),
  );
}

function getProjectRoot(projectId: string): string {
  return path.join(PROJECTS_ROOT, projectId);
}

export function resolveCwd(projectId: string, cwdRelative: string): string {
  const root = getProjectRoot(projectId);
  const resolved = path.resolve(root, cwdRelative || ".");
  if (!resolved.startsWith(path.resolve(root)))
    throw new Error("Path outside project");
  return resolved;
}

/**
 * Run a whitelisted CLI command inside the project workspace.
 * Orchestrator executes; agents never run shell directly.
 */
export async function runCommand(
  projectId: string,
  command: string,
  cwdRelative = ".",
): Promise<{ stdout: string; stderr: string }> {
  if (!isAllowed(command)) {
    throw new Error(`Command not allowed: ${command.split(" ")[0]}...`);
  }
  const cwd = resolveCwd(projectId, cwdRelative);
  const { stdout, stderr } = await execAsync(command, {
    cwd,
    maxBuffer: 10 * 1024 * 1024,
    timeout: 300_000,
    env: { ...process.env, CI: "1", npm_config_yes: "true" },
  });
  return { stdout: stdout || "", stderr: stderr || "" };
}
