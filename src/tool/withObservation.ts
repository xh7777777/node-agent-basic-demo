import type { ToolHandler } from "./types.js";

const normalizeResult = (result: unknown): string => {
  if (typeof result === "string") {
    return result;
  }
  if (result === undefined) {
    return "";
  }
  try {
    const serialized = JSON.stringify(result);
    return serialized ?? "";
  } catch {
    return String(result);
  }
};

export const withObservation =
  (handler: ToolHandler): ToolHandler =>
  async (args: unknown) => {
    const result = await handler(args);
    const content = normalizeResult(result);
    return `<observation>${content}</observation>`;
  };
