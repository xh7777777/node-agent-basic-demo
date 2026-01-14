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
console.log("Loaded environment variables:", env);
