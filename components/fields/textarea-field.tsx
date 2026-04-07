import type { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TextareaFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
};

export function TextareaField({
  label,
  registration,
  error,
  placeholder,
  disabled,
  rows = 4
}: TextareaFieldProps) {
  const id = registration.name;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...registration}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
