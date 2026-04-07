import type { z } from "zod";
import { intakeFormSchema, submissionSchema } from "@/lib/validations/intake-schema";

export type IntakeFormValues = z.infer<typeof intakeFormSchema>;
export type SubmissionFormValues = z.infer<typeof submissionSchema>;
