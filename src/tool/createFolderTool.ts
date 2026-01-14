import { promises as fs } from "fs";
import { z } from "zod";

import type { ToolDef, ToolHandler } from "./types.js";
import { resolveWorkspacePath } from "./pathUtils.js";
import { withObservation } from "./withObservation.js";

const CreateFolderArgsSchema = z.object({
  path: z.string().min(1),
});

export const createFolderTool: ToolDef = {
  type: "function",
  function: {
    name: "create_folder",
    description: "Create a folder at the given path.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Absolute or workspace-relative folder path.",
        },
      },
      required: ["path"],
    },
  },
};

export const createFolderToolHandler: ToolHandler = withObservation(
  async (args) => {
    const { path: inputPath } = CreateFolderArgsSchema.parse(args);
    const targetPath = resolveWorkspacePath(inputPath);

    const existing = await fs
      .stat(targetPath)
      .then((stats) => stats)
      .catch(() => null);

    if (existing && !existing.isDirectory()) {
      throw new Error(`Path exists and is not a directory: ${targetPath}`);
    }

    await fs.mkdir(targetPath, { recursive: true });
    return `Created folder: ${targetPath}`;
  },
);
