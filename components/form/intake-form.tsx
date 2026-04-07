"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/fields/text-field";
import { TextareaField } from "@/components/fields/textarea-field";
import { SelectField } from "@/components/fields/select-field";
import { ErrorState } from "@/components/states/error-state";
import { SuccessState } from "@/components/states/success-state";
import { SubmitButton } from "@/components/form/submit-button";
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/lib/constants/form-options";
import type { SubmissionFormValues } from "@/lib/types/form";
import { submissionSchema } from "@/lib/validations/intake-schema";

type SubmitResponse =
  | {
      ok: true;
      message: string;
      usedAI: boolean;
      submittedAt: string;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof SubmissionFormValues, string[]>>;
    };

function buildDefaultValues(): SubmissionFormValues {
  return {
    name: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    mainObjective: "",
    targetAudience: "",
    mainPainPoints: "",
    timeline: "",
    budget: "",
    additionalNotes: "",
    website: "",
    submissionId:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  };
}

export function IntakeForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{
    message: string;
    usedAI: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: buildDefaultValues(),
    mode: "onBlur"
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    clearErrors();

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const data = (await response.json()) as SubmitResponse;

      if (!response.ok || !data.ok) {
        if ("fieldErrors" in data && data.fieldErrors) {
          for (const [field, messages] of Object.entries(data.fieldErrors)) {
            const firstMessage = messages?.[0];
            if (!firstMessage) continue;

            setError(field as keyof SubmissionFormValues, {
              type: "server",
              message: firstMessage
            });
          }
        }

        const message =
          "error" in data && data.error
            ? data.error
            : "Something went wrong while submitting the form.";

        setServerError(message);
        return;
      }

      setSuccessState({
        message: data.message,
        usedAI: data.usedAI
      });

      reset(buildDefaultValues());
    } catch {
      setServerError("Network error. Please try again.");
    }
  });

  if (successState) {
    return (
      <SuccessState
        message={successState.message}
        usedAI={successState.usedAI}
        onReset={() => {
          setSuccessState(null);
          setServerError(null);
          clearErrors();
          reset(buildDefaultValues());
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {serverError ? (
        <ErrorState
          message={serverError}
          onDismiss={() => {
            setServerError(null);
          }}
        />
      ) : null}

      <form noValidate onSubmit={onSubmit} className="space-y-6">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register("website")}
        />

        <input type="hidden" {...register("submissionId")} />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Name"
            placeholder="Jane Smith"
            registration={register("name")}
            error={errors.name?.message}
            disabled={isSubmitting}
            autoComplete="name"
          />

          <TextField
            label="Email"
            type="email"
            placeholder="jane@company.com"
            registration={register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
            autoComplete="email"
          />

          <TextField
            label="Company"
            placeholder="Acme Inc."
            registration={register("company")}
            error={errors.company?.message}
            disabled={isSubmitting}
            autoComplete="organization"
          />

          <TextField
            label="Role"
            placeholder="Founder"
            registration={register("role")}
            error={errors.role?.message}
            disabled={isSubmitting}
            autoComplete="organization-title"
          />

          <TextField
            label="Industry"
            placeholder="B2B SaaS"
            registration={register("industry")}
            error={errors.industry?.message}
            disabled={isSubmitting}
          />

          <TextField
            label="Target audience"
            placeholder="Operations leaders in SMBs"
            registration={register("targetAudience")}
            error={errors.targetAudience?.message}
            disabled={isSubmitting}
          />

          <SelectField
            label="Timeline"
            registration={register("timeline")}
            error={errors.timeline?.message}
            disabled={isSubmitting}
            placeholder="Select timeline"
            options={TIMELINE_OPTIONS}
          />

          <SelectField
            label="Budget"
            registration={register("budget")}
            error={errors.budget?.message}
            disabled={isSubmitting}
            placeholder="Select budget"
            options={BUDGET_OPTIONS}
          />
        </div>

        <TextareaField
          label="Main objective"
          placeholder="Describe the primary business outcome you want to achieve."
          registration={register("mainObjective")}
          error={errors.mainObjective?.message}
          disabled={isSubmitting}
          rows={4}
        />

        <TextareaField
          label="Main pain points"
          placeholder="Describe the problems, blockers, or inefficiencies you are facing."
          registration={register("mainPainPoints")}
          error={errors.mainPainPoints?.message}
          disabled={isSubmitting}
          rows={5}
        />

        <TextareaField
          label="Additional notes"
          placeholder="Anything else that would help provide better context."
          registration={register("additionalNotes")}
          error={errors.additionalNotes?.message}
          disabled={isSubmitting}
          rows={4}
        />

        <div className="space-y-3">
          <SubmitButton isSubmitting={isSubmitting} />
          <p className="text-center text-xs text-slate-500">
            Your submission is validated on both client and server before processing.
          </p>
        </div>
      </form>
    </div>
  );
}
