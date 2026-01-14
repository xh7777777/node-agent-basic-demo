/**
 * Centralize all Zod schemas and TypeScript types shared across the agent.
 * - Describe the shapes of tool definitions, ReAct messages, plan steps, and final answers.
 * - Include discriminated unions for the parser that interprets DeepSeek's JSON responses (`thought`, `action`, `observation`).
 * - Export helper infer types (e.g., `type ToolCall = z.infer<typeof ToolCallSchema>;`) for compile-time safety everywhere else.
 * - Keep these schemas aligned with what the prompts instruct the model to emit.
 */
