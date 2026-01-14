import type { ChatCompletionMessageToolCall } from "openai/resources/chat/completions.js";
import type { ToolDef, ToolRegistration } from "../tool/types.js";

export class ToolHandler {
  private tools: Map<string, ToolRegistration>;

  constructor() {
    this.tools = new Map();
  }

  public registerTool(tool: ToolRegistration) {
    this.tools.set(tool.tool.function.name, tool);
  }

  public listTools(): ToolDef[] {
    return Array.from(this.tools.values(), (entry) => entry.tool);
  }

  public async executeToolCall(call: ChatCompletionMessageToolCall) {
    if (call.type !== "function") {
      throw new Error(`Unsupported tool call type: ${call.type}`);
    }

    const tool = this.tools.get(call.function.name);
    if (!tool) {
      throw new Error(`Tool ${call.function.name} not found.`);
    }

    let parsedArgs: unknown = {};
    if (call.function.arguments) {
      try {
        parsedArgs = JSON.parse(call.function.arguments);
      } catch (error) {
        try {
          const sanitized = sanitizeToolArguments(call.function.arguments);
          parsedArgs = JSON.parse(sanitized);
        } catch (sanitizedError) {
          throw new Error(
            `Failed to parse tool arguments for ${call.function.name}: ${String(
              sanitizedError,
            )}`,
          );
        }
      }
    }

    return await tool.handler(parsedArgs);
  }
}

const sanitizeToolArguments = (raw: string): string => {
  let output = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];

    if (escaped) {
      output += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      output += char;
      escaped = true;
      continue;
    }

    if (char === "\"") {
      output += char;
      inString = !inString;
      continue;
    }

    if (inString) {
      if (char === "\n") {
        output += "\\n";
        continue;
      }
      if (char === "\r") {
        output += "\\r";
        continue;
      }
      if (char === "\t") {
        output += "\\t";
        continue;
      }
    }

    output += char;
  }

  return output;
};
