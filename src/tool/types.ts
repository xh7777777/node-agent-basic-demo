/**
 * Outline the tool contract here.
 * - Specify the fields every tool must implement (name, description, schema, `execute`).
 * - Document how tools report success vs. failure and how they should format observations for the LLM.
 * - Provide helper Zod schemas for reusable argument patterns (file path, code block, shell command, etc.).
 * - Mention any safety validations (path normalization, workspace boundaries) that tool authors must follow.
 */
import { z } from "zod";

export const ToolDefSchema = z.object({
  type: z.literal("function"),
  function: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
    strict: z.boolean().nullable().optional(),
  }),
});

export type ToolDef = z.infer<typeof ToolDefSchema>;

export type ToolHandler = (args: unknown) => Promise<unknown> | unknown;

export type ToolRegistration = {
  tool: ToolDef;
  handler: ToolHandler;
};
