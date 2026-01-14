/**
 * Encapsulate tool execution guarantees.
 * - Accept a registry of available tools plus a logger and the base working directory.
 * - Validate every incoming tool call (name + arguments) with Zod before touching the filesystem.
 * - Run tools sequentially, capturing stdout/stderr, execution time, and any file diffs produced.
 * - Surface sanitized tool outputs so the LLM sees concise results (e.g., truncated file previews).
 * - Provide guard rails such as max write size and deny-list certain paths outside the workspace.
 */
