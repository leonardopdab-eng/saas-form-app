import "server-only";

import OpenAI from "openai";
import { env } from "@/lib/env";
import { aiResultSchema, type AIResult } from "@/lib/types/ai-result";
import type { IntakeFormValues } from "@/lib/types/form";

function extractJsonObject(input: string) {
  const fenced = input.match(/```json\s*([\s\S]*?)```/i)?.[1];
  if (fenced) {
    return fenced.trim();
  }

  const firstBrace = input.indexOf("{");
  const lastBrace = input.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in model output.");
  }

  return input.slice(firstBrace, lastBrace + 1);
}

function createPrompt(answers: IntakeFormValues) {
  return [
    "You are a business intake analyst.",
    "Transform the following SaaS form answers into a strict JSON object.",
    "Return JSON only. Do not wrap the output in markdown.",
    'Use exactly these keys: "summary", "business_context", "urgency", "opportunities", "risks", "prompt_final", "recommended_next_step".',
    '"opportunities" must be an array of concise strings.',
    '"risks" must be an array of concise strings.',
    '"urgency" must be a short string such as low, medium, high, or critical.',
    "",
    "Form answers JSON:",
    JSON.stringify(answers, null, 2)
  ].join("\n");
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => resolve(null), timeoutMs);
    });

    const result = await Promise.race([promise, timeoutPromise]);
    return result as T | null;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function generateAIResult(
  answers: IntakeFormValues
): Promise<AIResult | null> {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  try {
    const response = await withTimeout(
      client.responses.create({
        model: env.OPENAI_MODEL,
        input: createPrompt(answers)
      }),
      env.OPENAI_TIMEOUT_MS
    );

    if (!response) {
      console.error("OpenAI enrichment timed out.");
      return null;
    }

    const outputText = typeof (response as { output_text?: unknown }).output_text === "string"
      ? (response as { output_text?: string }).output_text?.trim()
      : null;

    if (!outputText) {
      return null;
    }

    const parsedJson = JSON.parse(extractJsonObject(outputText)) as Omit<
      AIResult,
      "raw_answers"
    >;

    const validation = aiResultSchema.safeParse({
      ...parsedJson,
      raw_answers: answers
    });

    if (!validation.success) {
      console.error("OpenAI output validation failed:", validation.error.flatten());
      return null;
    }

    return validation.data;
  } catch (error) {
    console.error("OpenAI enrichment failed:", error);
    return null;
  }
}
