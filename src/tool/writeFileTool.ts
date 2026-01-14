import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import type { ToolDef, ToolHandler } from "./types.js";
import { resolveWorkspacePath } from "./pathUtils.js";
import { withObservation } from "./withObservation.js";

const WriteFileArgsSchema = z.object({
  path: z.string().min(1),
  content: z.string(),
  append: z.boolean().optional(),
});

export const writeFileTool: ToolDef = {
  type: "function",
  function: {
    name: "write_file",
    description: "Write content to a file (overwrite by default).",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Absolute or workspace-relative file path.",
        },
        content: {
          type: "string",
          description: "Content to write into the file.",
        },
        append: {
          type: "boolean",
          description: "Append instead of overwrite when true.",
        },
      },
      required: ["path", "content"],
    },
  },
};

export const writeFileToolHandler: ToolHandler = withObservation(async (args) => {
  const { path: inputPath, content, append } = WriteFileArgsSchema.parse(args);
  const targetPath = resolveWorkspacePath(inputPath);
  const dirPath = path.dirname(targetPath);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(targetPath, content, { flag: append ? "a" : "w" });

  return `Wrote ${content.length} chars to ${targetPath}`;
});
