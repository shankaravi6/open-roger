import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config.js";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  if (!genAI) genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI;
}

export async function generateForPhase(
  phase: string,
  userPrompt: string,
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-flash-latest" });

  const phasePrompts: Record<string, string> = {
    architecture: `You are the Architecture Agent. The user wants to build: "${userPrompt}".

Produce a short architecture document (markdown) that includes:
1. Roles (e.g. Admin, Staff, User)
2. Main modules
3. Tech stack: Next.js frontend, Node.js backend, MongoDB (Mongoose inside backend)
4. Folder structure: frontend/ (Next.js), backend/ (Node.js + Express + Mongoose only)

Output ONLY the markdown document, no extra commentary.`,

    database_design: `The user wants to build: "${userPrompt}".

You are the Database Agent. Design a MongoDB schema (collections and key fields) for this app. Schema and scripts live in the db/ folder (Mongoose used in backend).
Output a markdown document with:
1. List of collections (e.g. users, gym_members, bookings)
2. For each collection: field names and types (string, number, ObjectId, date, etc.)
3. Brief relation notes (references between collections)

Save this as db/schema.md. Output ONLY the markdown, no extra text.`,

    backend_development: `The user wants to build: "${userPrompt}".

You are the Backend Agent. Generate a minimal Node.js + Express backend.

First output the exact contents of package.json (valid JSON, with "name", "version", "type": "module", "dependencies" including "express" and "mongoose"). Then on the next line write exactly: ---FILE: src/index.js--- and then the exact contents of src/index.js (Express server on port 3001, express.json(), one GET /health route returning { ok: true }, and a comment that MongoDB connection will be added).

Format:
[package.json content as single line or escaped]
---FILE: src/index.js---
[full index.js content]

Output only these two file contents as specified.`,

    frontend_development: `The user wants to build: "${userPrompt}".

You are the Frontend Agent. Generate a minimal Next.js app structure.

Output exactly in this format, with no extra text before or after:
---FILE: package.json---
[valid package.json with "next", "react", "react-dom" in dependencies]
---FILE: src/app/page.tsx---
[default export: a simple page with a heading and short description of the app]
---FILE: src/app/layout.tsx---
[default export: root layout with html, body, and children]

Use ---FILE: path--- before each file's content. Output only these files.`,

    review_refinement: `The user wanted to build: "${userPrompt}".

You are in the Review phase. Output a short markdown summary (3-5 bullets) of what was generated: architecture, database design, backend, and frontend. No code.`,
  };

  const prompt =
    phasePrompts[phase] || `Summarize what should be done for: ${userPrompt}`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  if (!response || !response.text())
    throw new Error("Empty response from Gemini");
  return response.text();
}
