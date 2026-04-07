import "server-only";

import { Resend } from "resend";
import { buildSubmissionEmailHtml, buildSubmissionEmailText } from "@/emails/submission-email";
import { getRequiredEnv } from "@/lib/env";
import { AppError } from "@/lib/errors";
import type { AIResult } from "@/lib/types/ai-result";
import type { IntakeFormValues } from "@/lib/types/form";

type SendSubmissionEmailParams = {
  submissionId: string;
  submission: IntakeFormValues;
  aiResult: AIResult | null;
  submittedAt: string;
};

export async function sendSubmissionEmail({
  submissionId,
  submission,
  aiResult,
  submittedAt
}: SendSubmissionEmailParams) {
  const resendApiKey = getRequiredEnv("RESEND_API_KEY");
  const notificationEmail = getRequiredEnv("NOTIFICATION_EMAIL");
  const fromEmail = getRequiredEnv("RESEND_FROM_EMAIL");

  const resend = new Resend(resendApiKey);

  const subject = `New SaaS form submission — ${submission.name} (${submission.company})`;

  const { error } = await resend.emails.send(
    {
      from: fromEmail,
      to: [notificationEmail],
      subject,
      html: buildSubmissionEmailHtml({
        submission,
        aiResult,
        submittedAt
      }),
      text: buildSubmissionEmailText({
        submission,
        aiResult,
        submittedAt
      })
    },
    {
      idempotencyKey: `saas-form/${submissionId}`
    }
  );

  if (error) {
    console.error("Resend email delivery failed:", error);

    throw new AppError("Failed to send notification email", {
      statusCode: 502,
      exposeMessage: "The form was processed, but email delivery failed. Please try again."
    });
  }
}
