# SyncNet – Requirements Document (Factory Mode)

## 1. Overview

SyncNet is a **web-based software factory platform** that creates and evolves real applications using multiple AI agents under human approval.

A user describes what they want to build in natural language (for example: _“Create a Gym CRM from scratch”_). SyncNet then assigns specialized agents to plan, build, review, and improve the project step by step — with **live visibility and mandatory approvals at every phase**.

---

## 2. Core Concept

**SyncNet = Factory**
**Projects (e.g., Gym CRM) = Factory Output**

SyncNet does not run customer business data. It **creates and maintains project codebases** in a controlled, observable, and updatable way.

---

## 3. Entry Flow (User Experience)

1. User opens SyncNet web application
2. User enters a prompt:

   > "Create a Gym CRM from scratch"

3. SyncNet creates a new project workspace
4. Default agents are attached
5. Project enters Phase 1 (Architecture)

The user can watch everything **live** from the browser.

---

## 4. Default Agents (Auto-Created)

Every new project is created with **5 default agents**:

1. **Master / Orchestrator Agent**
   - Controls phase order
   - Manages dependencies
   - Decides when next phase can start

2. **Architecture Agent**
   - Defines roles (Admin, Staff, etc.)
   - Defines modules
   - Confirms tech stack

3. **Backend Agent**
   - Builds Node.js backend
   - Designs APIs
   - Implements business logic

4. **Frontend Agent**
   - Builds Next.js frontend
   - Integrates APIs
   - Creates screens and flows

5. **Database Agent**
   - Designs MongoDB schema
   - Defines collections and relations

No other agent may act before the Architecture phase is approved.

---

## 5. User-Added Agents (Dynamic)

At any time, the user may add extra agents to customize responsibilities, for example:

- Glassmorphism UI Agent
- Code Optimization Agent
- Design Pattern Agent
- Security Review Agent

Rules:

- Each added agent has a **strict scope**
- Agents may only modify allowed folders
- Orchestrator enforces boundaries

Agents can be added **even while a project is in progress**.

---

## 6. Phase-Based Workflow (Mandatory)

Projects move strictly phase by phase.

### Phase Flow

1. Architecture
2. Database Design
3. Backend Development
4. Frontend Development
5. Review / Refinement

Rules:

- Each phase produces visible output
- User must approve to continue
- On approval, next phase starts automatically
- User may pause, reject, or request changes

---

## 7. Live Visibility & Approval

For every project, the user can:

- View folder structure live
- Read generated code files
- See agent outputs
- Track which agent is running

Nothing advances without explicit user approval.

---

## 8. Factory Technology Stack (Strict – Phase 1)

SyncNet enforces a **single factory stack** for all created projects:

- Frontend: **Next.js**
- Backend: **Node.js**
- Database: **MongoDB**

This is non-configurable in Phase 1.

Reason:

- Predictable automation
- Safe execution
- Faster iteration

---

## 9. Automated Project Creation (Real Execution)

When a project starts, SyncNet automatically performs **real system actions**:

- Runs `npx create-next-app` for frontend
- Initializes Node.js backend
- Installs required npm packages
- Creates physical folders and files

Execution responsibility:

- Agents decide _what_ to build
- Orchestrator executes CLI commands

Agents never run shell commands directly.

---

## 10. Project Folder Structure (Mandatory)

Each project is stored in file-based workspaces:

```
/projects/{projectId}/
  ├─ frontend/   (Next.js)
  ├─ backend/    (Node.js)
  └─ db/         (MongoDB schema & scripts)
```

This structure is always maintained.

---

## 11. Storage Model

### SyncNet Database (MongoDB)

Stores only metadata:

- Users
- Projects
- Agents
- Tasks
- Approvals

### Project Code Storage

- File system (Phase 1)
- Migration to GitHub / AWS later

SyncNet never stores Gym CRM business data.

---

## 12. Updates & Evolution

If a user later requests:

> "Add follow-up automation"

Flow:

1. Master Agent analyzes impact
2. New tasks created
3. User reviews plan
4. Relevant agents execute
5. User approves

No destructive changes without approval.

---

## 13. Authentication & Accounts (Phase 1)

SyncNet uses **Clerk** for authentication and user management.

### 13.1 Supported Auth

- Email / Password
- OAuth (Google, GitHub)

All projects are strictly scoped to the authenticated user.

---

## 14. GitHub Integration (Optional – Phase 2)

Users may optionally connect their GitHub account.

### 14.1 Capabilities

- Import an existing repository into SyncNet
- Assign agents to an existing codebase
- Run agents in controlled phases
- Apply updates via commits

Imported repositories follow the same rules:

- Phase-based execution
- Human approval required
- Agent scope enforcement

GitHub integration is **optional** and not required to create new projects.

---

## 15. Deployment (Optional – Later)

Deployment to Vercel / Netlify / Render is:

- Optional
- Manual
- User-triggered

Not required for Phase 1.

---

## 14. Security Rules

- Workspace isolation per project
- Command whitelist only
- No cross-project access
- Gemini API key stays server-side

---

## 15. Phase 1 Success Criteria

SyncNet Phase 1 is successful if:

- A user can describe an app in plain English
- A real codebase is created automatically
- All steps are visible live
- Approvals control progression
- Project can evolve safely

---

## 16. One-Line Summary

**SyncNet is a human-approved, multi-agent software factory that turns intent into real, evolving code — using a fixed, reliable stack.**
