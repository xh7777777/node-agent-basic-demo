/**
 * Describe the command-execution tool here.
 * - Allow the agent to run shell commands (npm install, tests, formatters) in a controlled sandbox.
 * - Require explicit working directory plus a max duration and optional environment overrides.
 * - Capture stdout, stderr, and exit codes, then summarize them before handing back to the model.
 * - Consider redacting secrets from command output prior to logging or returning observations.
 */
