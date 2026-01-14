/**
 * Wrap the DeepSeek API here.
 * - Export a factory that reads `DEEPSEEK_API_KEY` and `DEEPSEEK_API_BASE` from the environment (validated via Zod).
 * - Expose a `chat` method that mirrors the OpenAI Chat Completions API shape, supporting streaming off by default.
 * - Handle retries (e.g., exponential backoff) plus descriptive errors to bubble up to the `AgentRunner`.
 * - Normalize responses into `{ role, content, id }` objects that the ReAct loop can store verbatim.
 * - Keep this file free of CLI or tool logic; it's strictly the network boundary.
 */

// Please install OpenAI SDK first: `npm install openai`
import env from "@/utils/loadEnv.js";
import { getSystemPrompt } from "@/prompt/systemPrompt.js";
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions.js";

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: env.DEEPSEEK_API_BASE,
  apiKey: env.DEEPSEEK_API_KEY,
});

type DeepseekClientOptions = {
  model?: string;
};

type DeepseekChatParams = {
  messages: ChatCompletionMessageParam[];
  temperature?: number;
  tools?: ChatCompletionTool[];
};

type DeepseekChatResult = {
  id: string;
  message: ChatCompletionMessage;
};

export default class DeepseekClient {
  private model: string;

  constructor(options: DeepseekClientOptions = {}) {
    this.model = options.model ?? "deepseek-chat";
  }

  public async chat(params: DeepseekChatParams): Promise<DeepseekChatResult> {
    const systemPrompt = getSystemPrompt();
    const allMessages: DeepseekChatParams["messages"] = [
      { role: "system", content: systemPrompt },
      ...params.messages,
    ];

    const response = await openai.chat.completions.create({
      model: this.model,
      messages: allMessages,
      temperature: params.temperature,
      tools: params.tools,
      stream: false,
    });

    const message = response.choices[0]?.message;
    if (!message) {
      throw new Error("DeepSeek response missing message content.");
    }

    return { id: response.id, message };
  }
}
