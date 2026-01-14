/**
 * Implement the core ReAct loop here.
 * - Define an `AgentRunner` class that accepts the DeepSeek client, tool registry, and system/task prompts.
 * - Maintain structured state: conversation history, scratchpad of tool outputs, and current working file target.
 * - Each iteration should:
 *   1. Build a message array that includes the system prompt, last tool results, and explicit instructions about codebase goals.
 *   2. Call the DeepSeek API for the next action (thought or tool call).
 *   3. Parse the model output with Zod to distinguish between "THOUGHT", "ACTION", and "FINAL" moves.
 *   4. Dispatch tool invocations sequentially (never parallelize) and append their results back into the context before the next LLM call.
 * - Provide hooks for logging progress and for surfacing intermediate diffs when the file tool writes to disk.
 * - Stop when the model returns a `final_answer` describing the completed Snake implementation instructions.
 */
