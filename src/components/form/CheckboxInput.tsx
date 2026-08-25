import { useId } from "react";
import type { CheckboxFieldConfig } from "./types";
import { FieldLayout } from "./FieldLayout";

interface CheckboxInputProps extends CheckboxFieldConfig {
  value: boolean;
  error?: string;
  onChange: (value: boolean) => void;
}

export function CheckboxInput({ value, error, onChange, ...field }: CheckboxInputProps) {
  const generatedId = useId();
  const id = `${field.name}-${generatedId}`;

  return (
    <FieldLayout {...field} id={id} error={error} hideLabel>
      <label className="form-field__choice" htmlFor={id}>
        <input
          id={id}
          name={field.name}
          type="checkbox"
          checked={value}
          required={field.required}
          disabled={field.disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : field.description ? `${id}-description` : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>
          {field.checkboxLabel}
          {field.required && <span className="form-field__required" aria-hidden="true"> *</span>}
        </span>
      </label>
    </FieldLayout>
  );
}
