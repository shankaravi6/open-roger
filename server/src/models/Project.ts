import mongoose from "mongoose";

const phaseEnum = [
  "architecture",
  "database_design",
  "backend_development",
  "frontend_development",
  "review_refinement",
] as const;

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    currentPhase: {
      type: String,
      enum: phaseEnum,
      default: "architecture",
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "rejected"],
      default: "active",
    },
    workspacePath: { type: String },
    folderStructure: { type: mongoose.Schema.Types.Mixed },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
export type Phase = (typeof phaseEnum)[number];
