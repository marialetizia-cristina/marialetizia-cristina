import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { FormField } from "./FormField";
import type { FormErrors, FormFieldConfig, FormValue, FormValues } from "./types";
import "../../style/Form.css";

interface DynamicFormProps {
  fields: FormFieldConfig[];
  onSubmit: (values: FormValues) => void | Promise<void>;
  initialValues?: FormValues;
  submitLabel?: string;
  submittingLabel?: string;
  className?: string;
  children?: ReactNode;
  externalErrors?: FormErrors;
}

function defaultValue(field: FormFieldConfig): FormValue {
  if (field.type === "checkbox") return false;
  if (field.type === "file") return null;
  return "";
}

function createInitialValues(fields: FormFieldConfig[], supplied: FormValues): FormValues {
  return Object.fromEntries(fields.map((field) => [field.name, supplied[field.name] ?? defaultValue(field)]));
}

function isEmpty(value: FormValue): boolean {
  if (value === null || value === "" || value === false) return true;
  if (typeof FileList !== "undefined" && value instanceof FileList) return value.length === 0;
  return false;
}

export function DynamicForm({
  fields,
  onSubmit,
  initialValues = {},
  submitLabel = "Invia",
  submittingLabel = "Invio in corso…",
  className,
  children,
  externalErrors = {},
}: DynamicFormProps) {
  const [values, setValues] = useState<FormValues>(() => createInitialValues(fields, initialValues));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(externalErrors).length > 0) setErrors((current) => ({ ...current, ...externalErrors }));
  }, [externalErrors]);

  const visibleFields = fields.filter((field) => field.isVisible?.(values) ?? true);

  const changeValue = (name: string, value: FormValue) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    visibleFields.forEach((field) => {
      const value = values[field.name] ?? defaultValue(field);
      if (field.required && isEmpty(value)) {
        nextErrors[field.name] = `Il campo “${field.label}” è obbligatorio.`;
        return;
      }
      const customError = field.validate?.(value, values);
      if (customError) nextErrors[field.name] = customError;
    });
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const visibleNames = new Set(visibleFields.map((field) => field.name));
      const submittedValues = Object.fromEntries(
        Object.entries(values).filter(([name]) => visibleNames.has(name)),
      );
      await onSubmit(submittedValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={`dynamic-form ${className ?? ""}`.trim()} onSubmit={handleSubmit} noValidate>
      {visibleFields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={values[field.name] ?? defaultValue(field)}
          error={errors[field.name]}
          onChange={(value) => changeValue(field.name, value)}
        />
      ))}
      {children}
      <button className="dynamic-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
