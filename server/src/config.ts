import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PROJECTS_ROOT =
  process.env.PROJECTS_ROOT || path.resolve(__dirname, "../../projects");

/** Gemini API key – server-side only, never expose to client */
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export const PHASES = [
  "architecture",
  "database_design",
  "backend_development",
  "frontend_development",
  "review_refinement",
] as const;

export const DEFAULT_AGENTS = [
  {
    name: "Master",
    role: "orchestrator",
    allowedFolders: [],
    order: 0,
    isDefault: true,
  },
  {
    name: "Architecture",
    role: "architecture",
    allowedFolders: [],
    order: 1,
    isDefault: true,
  },
  {
    name: "Database",
    role: "database",
    allowedFolders: ["db"],
    order: 2,
    isDefault: true,
  },
  {
    name: "Backend",
    role: "backend",
    allowedFolders: ["backend"],
    order: 3,
    isDefault: true,
  },
  {
    name: "Frontend",
    role: "frontend",
    allowedFolders: ["frontend"],
    order: 4,
    isDefault: true,
  },
];
