import { useId } from "react";
import type { TextareaFieldConfig } from "./types";
import { FieldLayout } from "./FieldLayout";

interface TextareaInputProps extends TextareaFieldConfig {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function TextareaInput({ value, error, onChange, ...field }: TextareaInputProps) {
  const generatedId = useId();
  const id = `${field.name}-${generatedId}`;

  return (
    <FieldLayout {...field} id={id} error={error}>
      <textarea
        id={id}
        className="form-field__control form-field__control--textarea"
        name={field.name}
        value={value}
        placeholder={field.placeholder}
        rows={field.rows ?? 5}
        minLength={field.minLength}
        maxLength={field.maxLength}
        required={field.required}
        disabled={field.disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : field.description ? `${id}-description` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldLayout>
  );
}
