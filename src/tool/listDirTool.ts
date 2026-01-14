import { promises as fs } from "fs";
import { z } from "zod";

import type { ToolDef, ToolHandler } from "./types.js";
import { resolveWorkspacePath } from "./pathUtils.js";
import { withObservation } from "./withObservation.js";

const ListDirArgsSchema = z.object({
  path: z.string().optional(),
});

export const listDirTool: ToolDef = {
  type: "function",
  function: {
    name: "ls",
    description: "List files and folders in a directory.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Absolute or workspace-relative directory path.",
        },
      },
      required: [],
    },
  },
};

export const listDirToolHandler: ToolHandler = withObservation(async (args) => {
  const { path: inputPath } = ListDirArgsSchema.parse(args);
  const targetPath = resolveWorkspacePath(inputPath ?? ".");
  const entries = await fs.readdir(targetPath, { withFileTypes: true });

  const formatted = entries
    .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))
    .sort((a, b) => a.localeCompare(b));

  return formatted.join("\n");
});
