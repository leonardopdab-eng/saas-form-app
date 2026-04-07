import { z } from "zod";
import { intakeFormSchema } from "@/lib/validations/intake-schema";

export const aiResultSchema = z.object({
  summary: z.string().min(1),
  business_context: z.string().min(1),
  urgency: z.string().min(1),
  opportunities: z.array(z.string().min(1)).min(1),
  risks: z.array(z.string().min(1)).min(1),
  prompt_final: z.string().min(1),
  recommended_next_step: z.string().min(1),
  raw_answers: intakeFormSchema
});

export type AIResult = z.infer<typeof aiResultSchema>;
