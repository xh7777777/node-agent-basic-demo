import { z } from "zod";

export const systemPromptConfigSchema = z.object({
  promptTemplate: z.string().optional(),
});
