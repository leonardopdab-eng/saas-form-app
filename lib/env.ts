import "server-only";

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY?.trim() || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY?.trim() || "",
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL?.trim() || "",
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL?.trim() || "",
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN?.trim() || "",
  OPENAI_MODEL: "gpt-4.1-mini",
  OPENAI_TIMEOUT_MS: readNumber(process.env.OPENAI_TIMEOUT_MS, 8000),
  RATE_LIMIT_WINDOW_MS: readNumber(process.env.RATE_LIMIT_WINDOW_MS, 10 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: readNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 5)
};

export function getRequiredEnv(
  key: "RESEND_API_KEY" | "NOTIFICATION_EMAIL" | "RESEND_FROM_EMAIL"
): string {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
