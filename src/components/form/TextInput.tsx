import { useId } from "react";
import type { TextFieldConfig } from "./types";
import { FieldLayout } from "./FieldLayout";

interface TextInputProps extends TextFieldConfig {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, error, onChange, ...field }: TextInputProps) {
  const generatedId = useId();
  const id = `${field.name}-${generatedId}`;

  return (
    <FieldLayout {...field} id={id} error={error}>
      <input
        id={id}
        className="form-field__control"
        name={field.name}
        type={field.type}
        value={value}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        minLength={field.minLength}
        maxLength={field.maxLength}
        pattern={field.pattern}
        min={field.min}
        required={field.required}
        disabled={field.disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : field.description ? `${id}-description` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldLayout>
  );
}
