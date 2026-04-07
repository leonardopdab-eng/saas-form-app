import type { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder: string;
  options: readonly Option[];
  disabled?: boolean;
};

export function SelectField({
  label,
  registration,
  error,
  placeholder,
  options,
  disabled
}: SelectFieldProps) {
  const id = registration.name;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        defaultValue=""
        {...registration}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
