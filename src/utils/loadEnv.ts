import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(dotenv.config());

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  DEEPSEEK_API_KEY: z.string().min(1, "DEEPSEEK_API_KEY is required"),
  DEEPSEEK_API_BASE: z.url("DEEPSEEK_API_BASE must be a valid URL"),
  DEEPSEEK_LOG_PAYLOAD: z.enum(["0", "1"]).default("0"),
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
