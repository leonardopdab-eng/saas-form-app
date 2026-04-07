import { NextResponse } from "next/server";
import { AppError, toPublicError } from "@/lib/errors";
import { env } from "@/lib/env";
import { consumeRateLimit } from "@/lib/rate-limit";
import { handleSubmission } from "@/lib/services/submission";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 30_000;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const requestOrigin = new URL(request.url).origin;
  const allowedOrigin = env.ALLOWED_ORIGIN || requestOrigin;

  return origin === allowedOrigin;
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      throw new AppError("Blocked cross-origin form submission", {
        statusCode: 403,
        exposeMessage: "This request origin is not allowed."
      });
    }

    const ip = getClientIp(request);
    const rateLimit = consumeRateLimit(
      `submit:${ip}`,
      env.RATE_LIMIT_MAX_REQUESTS,
      env.RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many submissions. Please wait and try again."
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds)
          }
        }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new AppError("Unsupported content type", {
        statusCode: 415,
        exposeMessage: "Invalid request format."
      });
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_BODY_BYTES) {
      throw new AppError("Payload too large", {
        statusCode: 413,
        exposeMessage: "Submission is too large."
      });
    }

    const rawBody = await request.text();

    if (!rawBody || rawBody.length > MAX_BODY_BYTES) {
      throw new AppError("Payload too large", {
        statusCode: 413,
        exposeMessage: "Submission is too large."
      });
    }

    const body = JSON.parse(rawBody);
    const result = await handleSubmission(body);

    return NextResponse.json(
      {
        ok: true,
        message: result.message,
        usedAI: result.usedAI,
        submittedAt: result.submittedAt
      },
      { status: 200 }
    );
  } catch (error) {
    const publicError = toPublicError(error);

    return NextResponse.json(
      {
        ok: false,
        error: publicError.message,
        fieldErrors: publicError.fieldErrors
      },
      { status: publicError.statusCode }
    );
  }
}
