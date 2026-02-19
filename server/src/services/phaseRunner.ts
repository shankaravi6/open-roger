import { PHASES } from "../config.js";
import { generateForPhase } from "./gemini.js";
import { writeProjectFile } from "./workspace.js";
import { runCommand } from "./orchestrator.js";

export type Phase = (typeof PHASES)[number];

/**
 * Parse Gemini output that uses ---FILE: path--- markers into { path, content } blocks.
 */
function parseFileBlocks(text: string): { path: string; content: string }[] {
  const blocks: { path: string; content: string }[] = [];
  const regex = /---FILE:\s*([^\s-][^\n]*?)---/g;
  const matches = [...text.matchAll(regex)];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const path = match[1].trim();
    const start = match.index! + match[0].length;
    const end = i < matches.length - 1 ? matches[i + 1].index! : text.length;
    let content = text.slice(start, end).trim();
    if (content.startsWith("```") && content.includes("```", 4)) {
      const endFence = content.indexOf("```", 4);
      content = content.slice(content.indexOf("\n", 4) + 1, endFence).trim();
    }
    blocks.push({ path, content });
  }
  return blocks;
}

/**
 * Run a generation phase for a project: AI output + real execution where required (req §9).
 */
export async function runPhase(
  projectId: string,
  phase: Phase,
  userPrompt: string,
): Promise<void> {
  const generated = await generateForPhase(phase, userPrompt);

  switch (phase) {
    case "architecture": {
      await writeProjectFile(projectId, "backend/architecture.md", generated);
      break;
    }

    case "database_design": {
      await writeProjectFile(projectId, "db/schema.md", generated);
      break;
    }

    case "backend_development": {
      let backendBlocks = parseFileBlocks(generated);
      if (backendBlocks.length === 0) {
        const marker = "---FILE: src/index.js---";
        const idx = generated.indexOf(marker);
        if (idx >= 0) {
          const pkgRaw = generated.slice(0, idx).trim();
          const indexRaw = generated.slice(idx + marker.length).trim();
          if (pkgRaw)
            backendBlocks.push({ path: "package.json", content: pkgRaw });
          if (indexRaw)
            backendBlocks.push({ path: "src/index.js", content: indexRaw });
        }
      }
      if (backendBlocks.length > 0) {
        for (const { path: filePath, content } of backendBlocks) {
          const normalized = filePath.replace(/^backend\/?/, "").trim();
          const targetPath = normalized
            ? `backend/${normalized}`
            : `backend/${filePath}`;
          await writeProjectFile(projectId, targetPath, content);
        }
        try {
          await runCommand(projectId, "npm install", "backend");
        } catch (err) {
          console.error("Backend npm install failed:", err);
        }
      } else {
        await writeProjectFile(projectId, "backend/backend.md", generated);
      }
      break;
    }

    case "frontend_development": {
      try {
        await runCommand(
          projectId,
          "npx create-next-app@latest . --yes",
          "frontend",
        );
      } catch (err) {
        console.error("create-next-app failed:", err);
      }
      const frontendBlocks = parseFileBlocks(generated);
      if (frontendBlocks.length > 0) {
        for (const { path: filePath, content } of frontendBlocks) {
          const normalized = filePath.replace(/^frontend\/?/, "").trim();
          const targetPath = normalized
            ? `frontend/${normalized}`
            : `frontend/${filePath}`;
          await writeProjectFile(projectId, targetPath, content);
        }
      } else {
        await writeProjectFile(projectId, "frontend/frontend.md", generated);
      }
      break;
    }

    case "review_refinement": {
      await writeProjectFile(projectId, "review.md", generated);
      break;
    }

    default: {
      await writeProjectFile(projectId, `notes/${phase}.md`, generated);
    }
  }
}
