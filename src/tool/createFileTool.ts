import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import type { ToolDef, ToolHandler } from "./types.js";
import { resolveWorkspacePath } from "./pathUtils.js";
import { withObservation } from "./withObservation.js";

const CreateFileArgsSchema = z.object({
  path: z.string().min(1),
  content: z.string().optional(),
});

export const createFileTool: ToolDef = {
  type: "function",
  function: {
    name: "create_file",
    description: "Create a new file at the given path.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Absolute or workspace-relative file path.",
        },
        content: {
          type: "string",
          description: "Optional initial content.",
        },
      },
      required: ["path"],
    },
  },
};

export const createFileToolHandler: ToolHandler = withObservation(async (args) => {
  const { path: inputPath, content } = CreateFileArgsSchema.parse(args);
  const targetPath = resolveWorkspacePath(inputPath);
  const dirPath = path.dirname(targetPath);

  await fs.mkdir(dirPath, { recursive: true });

  try {
    await fs.writeFile(targetPath, content ?? "", { flag: "wx" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create file ${targetPath}: ${message}`);
  }

  return `Created file: ${targetPath}`;
});
