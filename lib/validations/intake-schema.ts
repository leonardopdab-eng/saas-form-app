import { z } from "zod";

const requiredText = (label: string, minLength = 2, maxLength = 300) =>
  z
    .string({
      required_error: `${label} is required`
    })
    .trim()
    .min(minLength, `${label} is required`)
    .max(maxLength, `${label} must be ${maxLength} characters or less`);

export const intakeFormSchema = z.object({
  name: requiredText("Name", 2, 120),
  email: z
    .string({
      required_error: "Email is required"
    })
    .trim()
    .email("Please enter a valid email address")
    .max(160, "Email must be 160 characters or less"),
  company: requiredText("Company", 2, 160),
  role: requiredText("Role", 2, 120),
  industry: requiredText("Industry", 2, 120),
  mainObjective: requiredText("Main objective", 10, 1500),
  targetAudience: requiredText("Target audience", 4, 1000),
  mainPainPoints: requiredText("Main pain points", 10, 2000),
  timeline: requiredText("Timeline", 2, 120),
  budget: requiredText("Budget", 2, 120),
  additionalNotes: z
    .string()
    .trim()
    .max(2000, "Additional notes must be 2000 characters or less")
    .optional()
    .default("")
});

export const submissionSchema = intakeFormSchema.extend({
  submissionId: z
    .string({
      required_error: "Submission token is required"
    })
    .trim()
    .min(8, "Invalid submission token")
    .max(128, "Invalid submission token"),
  website: z
    .string()
    .trim()
    .max(0, "Invalid submission")
    .optional()
    .default("")
});
