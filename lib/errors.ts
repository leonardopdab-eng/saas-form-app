import type { ZodError } from "zod";

export type PublicFieldErrors = Record<string, string[]>;

export class AppError extends Error {
  statusCode: number;
  exposeMessage: string;
  fieldErrors?: PublicFieldErrors;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      exposeMessage?: string;
      fieldErrors?: PublicFieldErrors;
    }
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = options?.statusCode ?? 500;
    this.exposeMessage =
      options?.exposeMessage ?? "Something went wrong. Please try again.";
    this.fieldErrors = options?.fieldErrors;
  }
}

export function formatZodFieldErrors(error: ZodError): PublicFieldErrors {
  const flattened = error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(flattened).filter(
      ([, messages]) => Array.isArray(messages) && messages.length > 0
    )
  ) as PublicFieldErrors;
}

export function toPublicError(error: unknown): {
  statusCode: number;
  message: string;
  fieldErrors?: PublicFieldErrors;
} {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.exposeMessage,
      fieldErrors: error.fieldErrors
    };
  }

  if (error instanceof SyntaxError) {
    return {
      statusCode: 400,
      message: "Invalid request payload."
    };
  }

  console.error("Unhandled server error:", error);

  return {
    statusCode: 500,
    message: "Internal server error. Please try again."
  };
}
