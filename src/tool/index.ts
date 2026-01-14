/**
 * Explain how to register tools.
 * - Export a function that instantiates every tool (file writer, terminal, planner helpers, etc.) with shared dependencies.
 * - Return both a map by name for quick lookups and an ordered array for documentation prompts.
 * - Provide helper utilities for rendering the tool list inside the system prompt so the LLM knows what is available.
 */
import { ToolHandler } from "./toolHandler.js";
import { createFileTool, createFileToolHandler } from "./createFileTool.js";
import { createFolderTool, createFolderToolHandler } from "./createFolderTool.js";
import { getTimeTool, getTimeToolHandler } from "./getTimeTool.js";
import { listDirTool, listDirToolHandler } from "./listDirTool.js";
import { writeFileTool, writeFileToolHandler } from "./writeFileTool.js";

export const createToolHandler = (): ToolHandler => {
  const handler = new ToolHandler();
  handler.registerTool({
    tool: createFileTool,
    handler: createFileToolHandler,
  });
  handler.registerTool({
    tool: createFolderTool,
    handler: createFolderToolHandler,
  });
  handler.registerTool({
    tool: getTimeTool,
    handler: getTimeToolHandler,
  });
  handler.registerTool({
    tool: listDirTool,
    handler: listDirToolHandler,
  });
  handler.registerTool({
    tool: writeFileTool,
    handler: writeFileToolHandler,
  });
  return handler;
};
