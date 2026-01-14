import type { ToolDef, ToolHandler } from "./types.js";

export const getTimeTool: ToolDef = {
  type: "function",
  function: {
    name: "get_current_time",
    description: "Get the current system time in ISO 8601 format.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export const getTimeToolHandler: ToolHandler = async () => {
  console.log("Executing get_current_time tool");
  return new Date().toISOString();
};
