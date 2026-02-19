import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    phase: { type: String, required: true },
    userId: { type: String, required: true },
    action: {
      type: String,
      enum: ["approved", "rejected", "changes_requested"],
      required: true,
    },
    comment: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Approval = mongoose.model("Approval", approvalSchema);
