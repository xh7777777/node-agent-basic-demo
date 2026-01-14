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
        throw new Error(
          `Failed to parse tool arguments for ${call.function.name}: ${String(
            error,
          )}`,
        );
      }
    }

    return await tool.handler(parsedArgs);
  }
}
