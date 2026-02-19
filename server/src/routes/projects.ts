import { Router } from "express";
import { Project } from "../models/Project.js";
import { Agent } from "../models/Agent.js";
import { Task } from "../models/Task.js";
import { Approval } from "../models/Approval.js";
import {
  createProjectWorkspace,
  getFolderStructure,
  readProjectFile,
} from "../services/workspace.js";
import { runPhase } from "../services/phaseRunner.js";
import { getPreviewUrl, startPreview } from "../services/preview.js";
import { DEFAULT_AGENTS, PHASES } from "../config.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const projects = await Project.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { prompt, name } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });
    const projectName = name || prompt.slice(0, 50);
    const project = await Project.create({
      name: projectName,
      prompt,
      userId,
      currentPhase: PHASES[0],
      status: "active",
    });
    const workspacePath = await createProjectWorkspace(project._id.toString());
    const initialStructure = { frontend: {}, backend: {}, db: {} };
    await Project.updateOne(
      { _id: project._id },
      { workspacePath, folderStructure: initialStructure },
    );
    for (const agent of DEFAULT_AGENTS) {
      await Agent.create({
        ...agent,
        projectId: project._id,
      });
    }
    try {
      await runPhase(project._id.toString(), PHASES[0], prompt);
      const folderStructure = await getFolderStructure(project._id.toString());
      await Project.updateOne({ _id: project._id }, { folderStructure });
      const phaseRole: Record<string, string> = {
        architecture: "architecture",
        database_design: "database",
        backend_development: "backend",
        frontend_development: "frontend",
        review_refinement: "orchestrator",
      };
      const agentDoc = await Agent.findOne({
        projectId: project._id,
        role: phaseRole[PHASES[0]],
      });
      if (agentDoc) {
        await Task.create({
          projectId: project._id,
          agentId: agentDoc._id,
          phase: PHASES[0],
          title: `Phase: ${PHASES[0]}`,
          output: "Architecture document generated",
          status: "completed",
        });
      }
    } catch (genErr) {
      console.error("Architecture phase generation failed:", genErr);
    }
    const populated = await Project.findById(project._id).lean();
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({
      _id: req.params.id,
      userId,
    }).lean();
    if (!project) return res.status(404).json({ error: "Project not found" });
    const folderStructure = await getFolderStructure(req.params.id);
    res.json({ ...project, folderStructure });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id/structure", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({ _id: req.params.id, userId });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const folderStructure = await getFolderStructure(req.params.id);
    res.json(folderStructure);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id/file", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({ _id: req.params.id, userId });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const path = req.query.path as string;
    if (!path) return res.status(400).json({ error: "path query required" });
    const content = await readProjectFile(req.params.id, path);
    if (content === null)
      return res.status(404).json({ error: "File not found" });
    res.json({ path, content });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id/preview-url", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({
      _id: req.params.id,
      userId,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const url = getPreviewUrl(req.params.id);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/:id/preview-start", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({
      _id: req.params.id,
      userId,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const { url, port } = await startPreview(req.params.id);
    res.json({ url, port });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/:id/approve", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({ _id: req.params.id, userId });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const { action, comment } = req.body;
    if (!["approved", "rejected", "changes_requested"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }
    await Approval.create({
      projectId: project._id,
      phase: project.currentPhase,
      userId,
      action,
      comment,
    });
    if (action === "approved") {
      const idx = PHASES.indexOf(
        project.currentPhase as (typeof PHASES)[number],
      );
      const nextPhase =
        idx >= 0 && idx < PHASES.length - 1
          ? PHASES[idx + 1]
          : project.currentPhase;
      await Project.updateOne(
        { _id: project._id },
        { currentPhase: nextPhase },
      );
      const phaseRole: Record<string, string> = {
        architecture: "architecture",
        database_design: "database",
        backend_development: "backend",
        frontend_development: "frontend",
        review_refinement: "orchestrator",
      };
      try {
        await runPhase(
          project._id.toString(),
          nextPhase as (typeof PHASES)[number],
          project.prompt,
        );
        const folderStructure = await getFolderStructure(req.params.id);
        await Project.updateOne({ _id: project._id }, { folderStructure });
        const agentDoc = await Agent.findOne({
          projectId: project._id,
          role: phaseRole[nextPhase],
        });
        if (agentDoc) {
          await Task.create({
            projectId: project._id,
            agentId: agentDoc._id,
            phase: nextPhase,
            title: `Phase: ${nextPhase}`,
            output: `Phase ${nextPhase} completed`,
            status: "completed",
          });
        }
      } catch (genErr) {
        console.error(`Phase ${nextPhase} generation failed:`, genErr);
      }
    }
    if (action === "rejected") {
      await Project.updateOne({ _id: project._id }, { status: "rejected" });
    }
    const updated = await Project.findById(project._id).lean();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
