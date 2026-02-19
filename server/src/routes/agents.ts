import { Router } from "express";
import { Agent } from "../models/Agent.js";
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
    const agents = await Agent.find({ projectId: req.params.projectId })
      .sort({ order: 1 })
      .lean();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/project/:projectId", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const { name, role, allowedFolders } = req.body;
    if (!name || !role)
      return res.status(400).json({ error: "name and role required" });
    const maxOrder = await Agent.findOne({ projectId: project._id })
      .sort({ order: -1 })
      .select("order")
      .lean();
    const agent = await Agent.create({
      name,
      role,
      allowedFolders: allowedFolders || [],
      projectId: project._id,
      isDefault: false,
      order: (maxOrder?.order ?? 4) + 1,
    });
    res.status(201).json(agent);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
