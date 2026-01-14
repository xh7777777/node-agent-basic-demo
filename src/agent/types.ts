/**
 * Centralize all Zod schemas and TypeScript types shared across the agent.
 * - Describe the shapes of tool definitions, ReAct messages, plan steps, and final answers.
 * - Include discriminated unions for the parser that interprets DeepSeek's JSON responses (`thought`, `action`, `observation`).
 * - Export helper infer types (e.g., `type ToolCall = z.infer<typeof ToolCallSchema>;`) for compile-time safety everywhere else.
 * - Keep these schemas aligned with what the prompts instruct the model to emit.
 */
import { z } from "zod";
import { ToolDefSchema } from "@/tool/types.js";

export const ChatRoleSchema = z.enum(["system", "user", "assistant", "tool"]);

const SystemMessageSchema = z.object({
  role: z.literal("system"),
  content: z.string(),
});

const UserMessageSchema = z.object({
  role: z.literal("user"),
  content: z.string(),
});

const AssistantMessageSchema = z.object({
  role: z.literal("assistant"),
  content: z.string(),
});

const ToolMessageSchema = z.object({
  role: z.literal("tool"),
  content: z.string(),
  tool_call_id: z.string().min(1),
});

export const ChatMessageSchema = z.discriminatedUnion("role", [
  SystemMessageSchema,
  UserMessageSchema,
  AssistantMessageSchema,
  ToolMessageSchema,
]);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ToolCallSchema = z.object({
  id: z.string().optional(),
  type: z.literal("function"),
  function: z.object({
    name: z.string().min(1),
    arguments: z.string(),
  }),
});

export type ToolCall = z.infer<typeof ToolCallSchema>;

export const ThoughtSchema = z.object({
  type: z.literal("thought"),
  thought: z.string(),
});

export const ActionSchema = z.object({
  type: z.literal("action"),
  tool: z.string().min(1),
  args: z.record(z.string(), z.unknown()),
});

export const ObservationSchema = z.object({
  type: z.literal("observation"),
  observation: z.string(),
});

export const FinalSchema = z.object({
  type: z.literal("final"),
  final_answer: z.string(),
});

export const ReActStepSchema = z.discriminatedUnion("type", [
  ThoughtSchema,
  ActionSchema,
  ObservationSchema,
  FinalSchema,
]);

export type ReActStep = z.infer<typeof ReActStepSchema>;

export const NormalizedChatMessageSchema = z.object({
  id: z.string(),
  role: z.literal("assistant"),
  content: z.string(),
});

export type NormalizedChatMessage = z.infer<typeof NormalizedChatMessageSchema>;

export const DeepseekChatParamsSchema = z.object({
  messages: z.array(ChatMessageSchema),
  temperature: z.number().optional(),
  tools: z.array(ToolDefSchema).optional(),
});

export type DeepseekChatParams = z.infer<typeof DeepseekChatParamsSchema>;
