import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    scope: { type: String },
    allowedFolders: [{ type: String }],
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    isDefault: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Agent = mongoose.model("Agent", agentSchema);
