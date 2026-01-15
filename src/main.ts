/**
 * Bootstrapping instructions:
 * 1. Load environment variables via `dotenv/config` before any other imports.
 * 2. Parse CLI arguments (e.g., task prompt, working directory) and validate them with Zod.
 * 3. Instantiate the DeepSeek client and the tool registry, then inject them into `AgentRunner`.
 * 4. Kick off the ReAct loop with the initial task prompt (e.g., "Implement a playable Snake clone").
 * 5. Stream intermediate tool calls / thoughts to stdout so the user can watch the Claude-Code-like reasoning.
 * 6. Exit with code 0 on success and a non-zero code (plus helpful error message) on failure.
 */
import env from "@/utils/loadEnv.js";
import DeepseekClient from "@/agent/DeepseekClient.js";
import { createToolHandler } from "@/tool/index.js";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";

// const question =
//   "请在项目路径下创建一个snake文件夹，然后分别写css，js和html文件来实现一个贪吃蛇小游戏";
const question = "你最多能处理多少个字的输入文本";

const run = async () => {
  console.log("Loaded environment variables:", env);

  const client = new DeepseekClient();
  const toolHandler = createToolHandler();
  const tools = toolHandler.listTools();

  const messages: ChatCompletionMessageParam[] = [
    { role: "user", content: question },
  ];

  for (let turn = 0; turn < 20; turn += 1) {
    const response = await client.chat({ messages, tools });
    console.log("Received response from DeepSeek API.", response);
    const { message } = response;
    messages.push(message);

    const toolCalls = message.tool_calls ?? [];
    if (message.content?.includes("<final_answer>")) {
      console.log("Assistant:", message.content ?? "");
      return;
    }

    for (const call of toolCalls) {
      const result = await toolHandler.executeToolCall(call);
      const content =
        typeof result === "string" ? result : JSON.stringify(result);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content,
      });
    }
  }

  throw new Error("Too many tool-calling turns without a final answer.");
};

run().catch((error) => {
  console.error("Run failed:", error);
  process.exitCode = 1;
});
