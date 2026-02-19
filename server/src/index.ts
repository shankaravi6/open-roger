/// <reference types="node" />
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import projectsRouter from "./routes/projects.js";
import agentsRouter from "./routes/agents.js";
import tasksRouter from "./routes/tasks.js";

const PORT = 1001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/open-roger";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:1000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/projects", projectsRouter);
app.use("/api/agents", agentsRouter);
app.use("/api/tasks", tasksRouter);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
