/**
 * Wrap the DeepSeek API here.
 * - Export a factory that reads `DEEPSEEK_API_KEY` and `DEEPSEEK_API_BASE` from the environment (validated via Zod).
 * - Expose a `chat` method that mirrors the OpenAI Chat Completions API shape, supporting streaming off by default.
 * - Handle retries (e.g., exponential backoff) plus descriptive errors to bubble up to the `AgentRunner`.
 * - Normalize responses into `{ role, content, id }` objects that the ReAct loop can store verbatim.
 * - Keep this file free of CLI or tool logic; it's strictly the network boundary.
 */
