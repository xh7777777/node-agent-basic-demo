import fs from "fs";
import path from "path";
import pino from "pino";

type LoggerOptions = {
  filename: string;
  module: string;
  logDir?: string;
};

const defaultLogDir = path.resolve(process.cwd(), "src/log");

const ensureLogDir = (logDir: string) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

export const createPrettyLogger = ({
  filename,
  module,
  logDir = defaultLogDir,
}: LoggerOptions) => {
  ensureLogDir(logDir);

  const transport = pino.transport({
    target: "pino-pretty",
    options: {
      destination: path.join(logDir, filename),
      colorize: false,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  });

  return pino(transport).child({ module });
};

export const getLogDir = () => defaultLogDir;
