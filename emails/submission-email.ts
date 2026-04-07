import type { AIResult } from "@/lib/types/ai-result";
import type { IntakeFormValues } from "@/lib/types/form";
import { escapeHtml } from "@/lib/utils";

type SubmissionEmailParams = {
  submission: IntakeFormValues;
  aiResult: AIResult | null;
  submittedAt: string;
};

function renderAnswerRows(submission: IntakeFormValues) {
  const entries: Array<[string, string]> = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Company", submission.company],
    ["Role", submission.role],
    ["Industry", submission.industry],
    ["Main objective", submission.mainObjective],
    ["Target audience", submission.targetAudience],
    ["Main pain points", submission.mainPainPoints],
    ["Timeline", submission.timeline],
    ["Budget", submission.budget],
    ["Additional notes", submission.additionalNotes || "—"]
  ];

  return entries
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a; width: 180px; vertical-align: top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; white-space: pre-wrap;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");
}

function renderList(items: string[]) {
  if (!items.length) {
    return '<p style="margin: 0; color: #475569;">—</p>';
  }

  return `
    <ul style="margin: 0; padding-left: 20px; color: #334155;">
      ${items
        .map((item) => `<li style="margin: 6px 0;">${escapeHtml(item)}</li>`)
        .join("")}
    </ul>
  `;
}

export function buildSubmissionEmailHtml({
  submission,
  aiResult,
  submittedAt
}: SubmissionEmailParams) {
  const aiSection = aiResult
    ? `
      <section style="margin-top: 32px;">
        <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">AI Output</h2>

        <div style="display: grid; gap: 16px;">
          <div>
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Summary</h3>
            <p style="margin: 0; color: #334155; line-height: 1.7;">${escapeHtml(aiResult.summary)}</p>
          </div>

          <div>
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Business context</h3>
            <p style="margin: 0; color: #334155; line-height: 1.7;">${escapeHtml(aiResult.business_context)}</p>
          </div>

          <div>
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Urgency</h3>
            <p style="margin: 0; color: #334155; line-height: 1.7;">${escapeHtml(aiResult.urgency)}</p>
          </div>

          <div>
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Opportunities</h3>
            ${renderList(aiResult.opportunities)}
          </div>

          <div>
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Risks</h3>
            ${renderList(aiResult.risks)}
          </div>

          <div>
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Recommended next step</h3>
            <p style="margin: 0; color: #334155; line-height: 1.7;">${escapeHtml(aiResult.recommended_next_step)}</p>
          </div>

          <div>
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Final prompt</h3>
            <pre style="margin: 0; white-space: pre-wrap; word-break: break-word; border: 1px solid #e2e8f0; border-radius: 16px; background: #f8fafc; padding: 14px; color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; line-height: 1.6;">${escapeHtml(aiResult.prompt_final)}</pre>
          </div>
        </div>
      </section>
    `
    : `
      <section style="margin-top: 32px;">
        <h2 style="margin: 0 0 8px; font-size: 18px; color: #0f172a;">AI Output</h2>
        <p style="margin: 0; color: #475569; line-height: 1.7;">
          OpenAI enrichment was not used for this submission. The raw answers are included below.
        </p>
      </section>
    `;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <body style="margin: 0; padding: 24px; background: #f8fafc; font-family: Inter, Arial, sans-serif;">
        <div style="max-width: 880px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #64748b;">
            New SaaS Form Submission
          </p>
          <h1 style="margin: 0 0 8px; font-size: 28px; color: #0f172a;">
            ${escapeHtml(submission.name)} — ${escapeHtml(submission.company)}
          </h1>
          <p style="margin: 0; color: #475569; line-height: 1.7;">
            Submitted at ${escapeHtml(submittedAt)}
          </p>

          ${aiSection}

          <section style="margin-top: 32px;">
            <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a;">Raw Answers</h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
              <tbody>
                ${renderAnswerRows(submission)}
              </tbody>
            </table>
          </section>
        </div>
      </body>
    </html>
  `;
}

export function buildSubmissionEmailText({
  submission,
  aiResult,
  submittedAt
}: SubmissionEmailParams) {
  const rawAnswers = [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company}`,
    `Role: ${submission.role}`,
    `Industry: ${submission.industry}`,
    `Main objective: ${submission.mainObjective}`,
    `Target audience: ${submission.targetAudience}`,
    `Main pain points: ${submission.mainPainPoints}`,
    `Timeline: ${submission.timeline}`,
    `Budget: ${submission.budget}`,
    `Additional notes: ${submission.additionalNotes || "—"}`
  ].join("\n");

  const aiBlock = aiResult
    ? [
        "AI Output",
        "---------",
        `Summary: ${aiResult.summary}`,
        `Business context: ${aiResult.business_context}`,
        `Urgency: ${aiResult.urgency}`,
        `Opportunities: ${aiResult.opportunities.join(" | ")}`,
        `Risks: ${aiResult.risks.join(" | ")}`,
        `Recommended next step: ${aiResult.recommended_next_step}`,
        `Final prompt: ${aiResult.prompt_final}`
      ].join("\n")
    : "AI Output\n---------\nOpenAI enrichment was not used for this submission.";

  return [
    "New SaaS Form Submission",
    `Submitted at: ${submittedAt}`,
    "",
    aiBlock,
    "",
    "Raw Answers",
    "-----------",
    rawAnswers
  ].join("\n");
}
