import { useId } from "react";
import type { RadioFieldConfig } from "./types";

interface RadioGroupProps extends RadioFieldConfig {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function RadioGroup({ value, error, onChange, ...field }: RadioGroupProps) {
  const generatedId = useId();
  const descriptionId = `${field.name}-${generatedId}-description`;
  const errorId = `${field.name}-${generatedId}-error`;

  return (
    <fieldset
      className={`form-field ${error ? "form-field--invalid" : ""} ${field.className ?? ""}`.trim()}
      aria-describedby={error ? errorId : field.description ? descriptionId : undefined}
    >
      <legend className="form-field__label">
        {field.label}
        {field.required && <span className="form-field__required" aria-hidden="true"> *</span>}
      </legend>
      {field.description && <p id={descriptionId} className="form-field__description">{field.description}</p>}
      <div className="form-field__choices">
        {field.options.map((option) => {
          const optionId = `${field.name}-${option.value}-${generatedId}`;
          return (
            <label className="form-field__choice" htmlFor={optionId} key={option.value}>
              <input
                id={optionId}
                name={field.name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                required={field.required}
                disabled={field.disabled || option.disabled}
                onChange={(event) => onChange(event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {error && <p id={errorId} className="form-field__error" role="alert">{error}</p>}
    </fieldset>
  );
}
