type SuccessStateProps = {
  message: string;
  usedAI: boolean;
  onReset: () => void;
};

export function SuccessState({
  message,
  usedAI,
  onReset
}: SuccessStateProps) {
  return (
    <div className="space-y-6 py-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
        ✓
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
          Submission received
        </h3>
        <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">
          {message}
        </p>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          {usedAI ? "AI enrichment was applied" : "AI enrichment was skipped"}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 shadow-soft transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:ring-offset-2"
      >
        Submit another response
      </button>
    </div>
  );
}
