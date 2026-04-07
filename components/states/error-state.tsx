import { Alert } from "@/components/ui/alert";

type ErrorStateProps = {
  message: string;
  onDismiss?: () => void;
};

export function ErrorState({ message, onDismiss }: ErrorStateProps) {
  return (
    <Alert variant="error">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">Submission failed</p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
        </div>

        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm font-medium underline underline-offset-4"
          >
            Dismiss
          </button>
        ) : null}
      </div>
    </Alert>
  );
}
