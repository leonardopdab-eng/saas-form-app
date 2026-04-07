import "server-only";

import { AppError, formatZodFieldErrors } from "@/lib/errors";
import { sendSubmissionEmail } from "@/lib/services/email";
import { generateAIResult } from "@/lib/services/openai";
import type { SubmissionResult } from "@/lib/types/submission-result";
import { submissionSchema } from "@/lib/validations/intake-schema";

function sanitizeFieldErrors(fieldErrors: Record<string, string[]>) {
  return Object.fromEntries(
    Object.entries(fieldErrors).filter(
      ([key, messages]) =>
        !["submissionId", "website"].includes(key) &&
        Array.isArray(messages) &&
        messages.length > 0
    )
  );
}

export async function handleSubmission(payload: unknown): Promise<SubmissionResult> {
  const parsed = submissionSchema.safeParse(payload);

  if (!parsed.success) {
    throw new AppError("Validation failed", {
      statusCode: 400,
      exposeMessage: "Please review the highlighted fields and try again.",
      fieldErrors: sanitizeFieldErrors(formatZodFieldErrors(parsed.error))
    });
  }

  const { submissionId, website: _website, ...submission } = parsed.data;
  const submittedAt = new Date().toISOString();

  const aiResult = await generateAIResult(submission);

  await sendSubmissionEmail({
    submissionId,
    submission,
    aiResult,
    submittedAt
  });

  return {
    ok: true,
    message: "Your form has been submitted successfully.",
    usedAI: Boolean(aiResult),
    submittedAt,
    submission,
    aiResult
  };
}
