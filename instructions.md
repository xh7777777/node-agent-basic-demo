# ReAct Agent Implementation Guide

## Global Approach
1. **Keep the whole flow ReAct-friendly**: the LLM must iterate thought → tool call → observation until it emits a final answer. Every module should help enforce that deterministic choreography.
2. **Centralize validation with Zod**: CLI args, tool payloads, API responses, and model outputs all go through schemas so failures surface early and the agent can recover gracefully.
3. **Work incrementally**: finish one layer (types → client → tools → runner) before moving to the next. Run `npm run lint` after every major change to keep the codebase healthy.

## Suggested Implementation Sequence
1. **`agent/types.ts`**
   - Define Zod schemas for: chat messages, tool definitions, tool calls, DeepSeek replies, and the ReAct action union (`thought` | `action` | `final`).
   - Export helper type aliases with `z.infer` so the rest of the project can stay strictly typed.
2. **`agent/ReActContext.ts`**
   - Introduce classes or pure helpers for storing history, truncating context, and formatting scratchpads.
   - Ensure you can snapshot and restore state; future automation may need resumable runs.
3. **`agent/DeepseekClient.ts`**
   - Implement the HTTP wrapper around `axios`. Accept `{ messages, tools, temperature }`.
   - Add retry logic and convert API failures into structured `DeepseekClientError`.
4. **`tool/types.ts`**
   - Formalize the tool contract: `{ name, description, schema, execute }`.
   - Document the observation format (plain text capped at e.g. 2000 chars).
5. **`tool/fileTool.ts` & `tool/terminalTool.ts`**
   - File tool: resolve paths relative to the workspace, write files atomically, and return a diff summary.
   - Terminal tool: spawn a child process with timeout, capture stdout/stderr, redact secrets.
6. **`tool/index.ts`**
   - Build `createToolRegistry({ workspaceRoot })` that instantiates both tools and returns `{ list, map }`.
7. **`prompt/systemPrompt.ts` & `prompt/taskTemplates.ts`**
   - Compose string builders that describe available tools, JSON response schema, and the Snake-specific requirements (HTML canvas, keyboard controls, scoring, restart, etc.).
8. **`agent/ToolExecutor.ts`**
   - Given a parsed tool call, look it up in the registry, validate args, execute, and produce a normalized observation.
   - Add logging hooks (e.g., callbacks invoked with `{ toolName, args, result }`).
9. **`agent/AgentRunner.ts`**
   - Glue everything together: while loop that feeds messages into DeepSeek, switches on the parsed action, dispatches tools, and appends observations back into context.
   - Enforce stop conditions (max iterations, final response, or fatal error).
10. **`main.ts`**
    - Wire CLI parsing (`zod` + `process.argv`), load `.env`, create the client + registry + runner, and pass in the user prompt/task template.
    - Stream logs to stdout (`console.log` or a small logger) so users see the “Claude code” style trace.

## Additional Tips
- **Testing**: craft fixture prompts that stub DeepSeek responses so you can unit-test the runner without hitting the network.
- **Observability**: add verbose logging toggled by an env var (`DEBUG=1`) to inspect each ReAct turn.
- **Safety**: keep the tool layer strict about workspace boundaries and command timeouts; never trust raw model output.
- **Snake deliverable**: instruct the agent (via prompts) to build the game file-by-file, verifying each stage with the terminal tool (e.g., `npm run lint`, `npm run dev -- --check`, etc.).
