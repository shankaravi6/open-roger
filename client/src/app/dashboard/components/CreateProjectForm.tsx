"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { createProject } from "@/lib/api";
import { ModelSelect } from "@/app/components/ModelSelect";

const DEMO_USER_ID = "demo-user";

export function CreateProjectForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || !selectedModel.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const project = await createProject(DEMO_USER_ID, prompt.trim());
      router.push(`/dashboard/projects/${project._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="liquid-glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white">Create a new project</h2>
      <p className="mt-1 text-sm text-muted-teal">
        Describe what you want to build in plain English. SyncNet will create a
        workspace and assign default agents.
      </p>
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-muted-teal">
          Choose AI model <span className="text-error">*</span>
        </label>
        <ModelSelect
          value={selectedModel}
          onChange={setSelectedModel}
          aria-label="Choose AI model"
        />
      </div>
      <div className="mt-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Create a Gym CRM from scratch"
          rows={3}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-muted-teal focus:border-pink focus:outline-none focus:ring-1 focus:ring-pink"
          disabled={loading}
        />
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      <button
        type="submit"
        disabled={loading || !prompt.trim() || !selectedModel.trim()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pink px-5 py-2.5 font-medium text-white transition-colors hover:bg-light-purple disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Create project
          </>
        )}
      </button>
    </form>
  );
}
