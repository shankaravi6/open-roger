import { Router } from "express";
import { Task } from "../models/Task.js";
import { Project } from "../models/Project.js";

const router = Router();

router.get("/project/:projectId", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate("agentId", "name role")
      .sort({ createdAt: -1 })
      .lean();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/project/:projectId/approvals", async (req, res) => {
  try {
    const { Approval } = await import("../models/Approval.js");
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const approvals = await Approval.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
