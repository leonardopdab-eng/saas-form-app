import type { AIResult } from "@/lib/types/ai-result";
import type { IntakeFormValues } from "@/lib/types/form";

export type SubmissionResult = {
  ok: true;
  message: string;
  usedAI: boolean;
  submittedAt: string;
  submission: IntakeFormValues;
  aiResult: AIResult | null;
};
