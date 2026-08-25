import { useId } from "react";
import type { SelectFieldConfig } from "./types";
import { FieldLayout } from "./FieldLayout";

interface SelectInputProps extends SelectFieldConfig {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function SelectInput({ value, error, onChange, ...field }: SelectInputProps) {
  const generatedId = useId();
  const id = `${field.name}-${generatedId}`;

  return (
    <FieldLayout {...field} id={id} error={error}>
      <select
        id={id}
        className="form-field__control"
        name={field.name}
        value={value}
        required={field.required}
        disabled={field.disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : field.description ? `${id}-description` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {field.placeholder && <option value="">{field.placeholder}</option>}
        {field.options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldLayout>
  );
}
