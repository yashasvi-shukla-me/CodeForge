/**
 * Validate required environment variables at startup.
 * Call this before starting the server.
 */
const REQUIRED = [
  "DATABASE_URL",
  "JWT_SECRET",
];

const OPTIONAL_JUDGE0 = ["JUDGE0_API_URL", "JUDGE0_API_KEY"];

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}. Check .env and .env.example.`
    );
    process.exit(1);
  }
  // Warn if Judge0 is not set (code execution will fail)
  const missingJudge0 = OPTIONAL_JUDGE0.filter((key) => !process.env[key]?.trim());
  if (missingJudge0.length > 0 && process.env.NODE_ENV === "production") {
    console.warn(
      `Judge0 env not set (${missingJudge0.join(", ")}). Code execution endpoints may fail.`
    );
  }
}
