import { useId } from "react";
import type { FileFieldConfig } from "./types";
import { FieldLayout } from "./FieldLayout";

interface FileInputProps extends FileFieldConfig {
  error?: string;
  onChange: (value: FileList | null) => void;
}

export function FileInput({ error, onChange, ...field }: FileInputProps) {
  const generatedId = useId();
  const id = `${field.name}-${generatedId}`;

  return (
    <FieldLayout {...field} id={id} error={error}>
      <input
        id={id}
        className="form-field__control form-field__control--file"
        name={field.name}
        type="file"
        accept={field.accept}
        multiple={field.multiple}
        required={field.required}
        disabled={field.disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : field.description ? `${id}-description` : undefined}
        onChange={(event) => onChange(event.target.files)}
      />
    </FieldLayout>
  );
}
