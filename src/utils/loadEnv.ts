import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(dotenv.config());

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  DEEPSEEK_API_KEY: z.string().min(1, "DEEPSEEK_API_KEY is required"),
  DEEPSEEK_API_BASE: z.string().url("DEEPSEEK_API_BASE must be a valid URL"),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  console.error("Environment variable validation failed:", error);
  process.exit(1);
}

export default env;
