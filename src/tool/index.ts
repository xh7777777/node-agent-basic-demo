/**
 * Explain how to register tools.
 * - Export a function that instantiates every tool (file writer, terminal, planner helpers, etc.) with shared dependencies.
 * - Return both a map by name for quick lookups and an ordered array for documentation prompts.
 * - Provide helper utilities for rendering the tool list inside the system prompt so the LLM knows what is available.
 */
import { ToolHandler } from "./toolHandler.js";
import { getTimeTool, getTimeToolHandler } from "./getTimeTool.js";

export const createToolHandler = (): ToolHandler => {
  const handler = new ToolHandler();
  handler.registerTool({
    tool: getTimeTool,
    handler: getTimeToolHandler,
  });
  return handler;
};
