/**
 * Define the shared context and state helpers here.
 * - Model the conversation memory, current objective, tool queue, and working directory.
 * - Provide pure helper functions for appending messages, clipping history, and formatting the scratchpad before each model call.
 * - Document how the agent should persist step-by-step decisions so it can resume if the process restarts.
 * - Keep this file dependency-light (only Zod + internal types) to avoid circular imports.
 */
