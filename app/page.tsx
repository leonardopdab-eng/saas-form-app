import { FormCard } from "@/components/form/form-card";
import { IntakeForm } from "@/components/form/intake-form";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <div className="w-full space-y-8">
          <section className="space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600 shadow-soft backdrop-blur">
              Business Intake Form
            </div>

            <div className="space-y-3">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Share your business context and receive a structured intake result.
              </h1>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Fill out the form below. Your submission is validated, processed on the
                server, optionally enriched with AI, and delivered directly to the
                notification inbox.
              </p>
            </div>
          </section>

          <FormCard>
            <IntakeForm />
          </FormCard>
        </div>
      </div>
    </main>
  );
}
