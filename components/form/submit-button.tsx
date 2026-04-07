type SubmitButtonProps = {
  isSubmitting: boolean;
};

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white shadow-soft transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? "Submitting..." : "Submit form"}
    </button>
  );
}
