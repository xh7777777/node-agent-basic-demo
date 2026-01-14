import path from "path";

const workspaceRoot = process.cwd();

export const resolveWorkspacePath = (inputPath: string): string => {
  const resolved = path.resolve(workspaceRoot, inputPath);
  if (
    resolved !== workspaceRoot &&
    !resolved.startsWith(workspaceRoot + path.sep)
  ) {
    throw new Error(`Path is outside workspace: ${inputPath}`);
  }
  return resolved;
};

export const getWorkspaceRoot = (): string => workspaceRoot;
