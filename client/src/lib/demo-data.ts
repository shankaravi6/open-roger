/**
 * Demo/mock data for SyncNet frontend-only mode (no backend, no DB).
 * Used when NEXT_PUBLIC_DEMO_MODE=true or no API is configured.
 */

export const PHASES = [
  "architecture",
  "database_design",
  "backend_development",
  "frontend_development",
  "review_refinement",
] as const;

export const PHASE_LABELS: Record<string, string> = {
  architecture: "Architecture",
  database_design: "Database Design",
  backend_development: "Backend Development",
  frontend_development: "Frontend Development",
  review_refinement: "Review / Refinement",
};

/** Content shown for each phase (Master → Database → Backend → Frontend → Review). */
export const PHASE_DELIVERABLE: Record<
  string,
  { title: string; agent: string; content: string[] }
> = {
  architecture: {
    title: "Architecture",
    agent: "Master / Orchestrator Agent",
    content: [
      "Roles: Admin, Staff.",
      "Modules: Members, Plans, Subscriptions.",
      "Tech stack: Next.js (frontend), Node.js (backend), MongoDB.",
    ],
  },
  database_design: {
    title: "Database Design",
    agent: "Database Agent",
    content: [
      "Collections: members, plans, subscriptions.",
      "Models: Member (name, email, planId), Plan (name, price, duration), Subscription (memberId, planId, start, end).",
      "Seed script: seed/run.js.",
    ],
  },
  backend_development: {
    title: "Backend Development",
    agent: "Backend Agent",
    content: [
      "Express server, routes: /api/members, /api/subscriptions.",
      "backend/models/, backend/seed/run.js, package.json with npm run seed.",
    ],
  },
  frontend_development: {
    title: "Frontend Development",
    agent: "Frontend Agent",
    content: [
      "Next.js app: app/page.tsx, layout.tsx, dashboard.",
      "Components: MemberList. Integrated with backend APIs.",
    ],
  },
  review_refinement: {
    title: "Review / Refinement",
    agent: "Orchestrator",
    content: ["All phases complete. Code review done. Ready for deployment."],
  },
};

export const DEFAULT_AGENTS = [
  {
    _id: "agent-master",
    name: "Orchestrator",
    role: "Master / Orchestrator",
    isDefault: true,
  },
  {
    _id: "agent-arch",
    name: "Architecture",
    role: "Architecture Agent",
    isDefault: true,
  },
  {
    _id: "agent-db",
    name: "Database",
    role: "Database Agent",
    isDefault: true,
  },
  {
    _id: "agent-backend",
    name: "Backend",
    role: "Backend Agent",
    isDefault: true,
  },
  {
    _id: "agent-frontend",
    name: "Frontend",
    role: "Frontend Agent",
    isDefault: true,
  },
];

/** Folder structure: two top-level folders (frontend, backend). Backend holds models, seed, package.json with seed script. */
export function getFolderStructureForPhase(
  phase: string,
): Record<string, unknown> {
  const base = {
    frontend: {} as Record<string, unknown>,
    backend: {} as Record<string, unknown>,
  };

  const idx = PHASES.indexOf(phase as (typeof PHASES)[number]);
  // Architecture: no files yet (Master shows architecture only)
  // Database design: backend with models + seed
  if (idx >= 1) {
    base.backend = {
      models: {
        "Member.js": "file",
        "Plan.js": "file",
        "Subscription.js": "file",
      },
      seed: { "run.js": "file" },
      "package.json": "file",
    };
  }
  // Backend development: add src + routes
  if (idx >= 2) {
    (base.backend as Record<string, unknown>) = {
      ...(base.backend as object),
      models: {
        "Member.js": "file",
        "Plan.js": "file",
        "Subscription.js": "file",
      },
      seed: { "run.js": "file" },
      src: {
        "index.js": "file",
        routes: { "members.js": "file", "subscriptions.js": "file" },
      },
      "package.json": "file",
    };
  }
  // Frontend development
  if (idx >= 3) {
    base.frontend = {
      src: {
        app: {
          "page.tsx": "file",
          "layout.tsx": "file",
          dashboard: { "page.tsx": "file" },
        },
        components: { "MemberList.tsx": "file" },
      },
      "package.json": "file",
    };
  }
  return base;
}

/** Mock file contents for demo "view code" (§7). */
export const DEMO_FILE_CONTENT: Record<string, string> = {
  "backend/models/Member.js": `const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Member', memberSchema);
`,
  "backend/models/Plan.js": `const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, enum: ['monthly', 'yearly'] },
});

module.exports = mongoose.model('Plan', planSchema);
`,
  "backend/models/Subscription.js": `const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
`,
  "backend/seed/run.js": `const mongoose = require('mongoose');
const Member = require('../models/Member');
const Plan = require('../models/Plan');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const plan = await Plan.create({ name: 'Premium', price: 29, duration: 'monthly' });
  await Member.create([
    { name: 'Jane Doe', email: 'jane@example.com', planId: plan._id },
    { name: 'John Smith', email: 'john@example.com', planId: plan._id },
  ]);
  console.log('Seed done');
  process.exit(0);
}
run().catch((err) => { console.error(err); process.exit(1); });
`,
  "backend/package.json": `{
  "name": "gym-crm-backend",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "seed": "node seed/run.js"
  },
  "dependencies": {
    "express": "^4.18",
    "mongoose": "^8"
  }
}
`,
  "backend/src/index.js": `const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/members', require('./routes/members'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
module.exports = app;
`,
  "backend/src/routes/members.js": `// Members API – demo
router.get('/', async (req, res) => {
  const members = await db.collection('members').find().toArray();
  res.json(members);
});
`,
  "backend/src/routes/subscriptions.js": `// Subscriptions API – demo
router.get('/', async (req, res) => {
  const subs = await db.collection('subscriptions').find().toArray();
  res.json(subs);
});
`,
  "frontend/src/app/page.tsx": `export default function Home() {
  return (
    <div>
      <h1>Gym CRM</h1>
      <p>Welcome. Sign in or view dashboard.</p>
    </div>
  );
}
`,
  "frontend/src/app/layout.tsx": `export default function RootLayout({ children }) {
  return (
    <html><body>{children}</body></html>
  );
}
`,
  "frontend/src/app/dashboard/page.tsx": `export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Members and subscriptions overview.</p>
    </div>
  );
}
`,
  "frontend/src/components/MemberList.tsx": `export function MemberList({ members }) {
  return (
    <ul>
      {members?.map(m => <li key={m._id}>{m.name}</li>)}
    </ul>
  );
}
`,
  "frontend/package.json": `{
  "name": "gym-crm-frontend",
  "scripts": { "dev": "next dev" },
  "dependencies": { "next": "^14", "react": "^18" }
}
`,
};

export function getDemoFileContent(filePath: string): string | null {
  const normalized = filePath.replace(/^\/+/, "").replace(/\\/g, "/");
  return (
    DEMO_FILE_CONTENT[normalized] ??
    `// Demo file: ${normalized}\n// (Generated by SyncNet – no backend in demo mode.)`
  );
}

/** Generate demo tasks for a phase. */
export function getTasksForPhase(
  projectId: string,
  phase: string,
): Array<{
  _id: string;
  phase: string;
  title: string;
  output?: string;
  status: string;
  agentId?: { name: string; role: string };
  createdAt: string;
}> {
  const agent =
    DEFAULT_AGENTS.find((a) =>
      a.role.toLowerCase().includes(phase.split("_")[0]),
    ) ?? DEFAULT_AGENTS[1];
  const outputs: Record<string, string> = {
    architecture:
      "Roles: Admin, Staff. Modules: Members, Plans, Subscriptions. Stack: Next.js, Node.js, MongoDB.",
    database_design:
      "Collections: members, plans, subscriptions. Indexes and relations defined.",
    backend_development:
      "Express server, /api/members and /api/subscriptions routes.",
    frontend_development:
      "Next.js app with dashboard and member list components.",
    review_refinement: "Code review completed. Ready for deployment.",
  };
  return [
    {
      _id: `task-${projectId}-${phase}-1`,
      phase,
      title: `${PHASE_LABELS[phase] ?? phase} – main task`,
      output: outputs[phase],
      status: "completed",
      agentId: { name: agent.name, role: agent.role },
      createdAt: new Date().toISOString(),
    },
  ];
}

export function createDemoProject(
  prompt: string,
  name?: string,
): {
  _id: string;
  name: string;
  prompt: string;
  currentPhase: string;
  status: string;
  folderStructure: Record<string, unknown>;
  createdAt: string;
  approvals: Array<{
    phase: string;
    action: string;
    comment?: string;
    createdAt: string;
  }>;
  customAgents: Array<{
    _id: string;
    name: string;
    role: string;
    allowedFolders?: string[];
    approved?: boolean;
  }>;
  /** After-completion request: 'dark' | 'glassmorphism' | undefined */
  previewVariant?: string;
} {
  const id = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const suggestedName = name || prompt.slice(0, 40).trim() || "New project";
  return {
    _id: id,
    name: suggestedName,
    prompt,
    currentPhase: "architecture",
    status: "in_progress",
    folderStructure: getFolderStructureForPhase("architecture"),
    createdAt: new Date().toISOString(),
    approvals: [],
    customAgents: [],
  };
}
