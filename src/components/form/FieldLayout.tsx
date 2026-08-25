import type { ReactNode } from "react";

interface FieldLayoutProps {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  children: ReactNode;
  hideLabel?: boolean;
}

export function FieldLayout({
  id,
  label,
  required = false,
  description,
  error,
  className,
  children,
  hideLabel = false,
}: FieldLayoutProps) {
  const classes = ["form-field", error ? "form-field--invalid" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {!hideLabel && (
        <label className="form-field__label" htmlFor={id}>
          {label}
          {required && <span className="form-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      {description && <p id={`${id}-description`} className="form-field__description">{description}</p>}
      {children}
      {error && <p id={`${id}-error`} className="form-field__error" role="alert">{error}</p>}
    </div>
  );
}
