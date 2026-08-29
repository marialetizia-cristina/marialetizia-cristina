export type FormValue = string | boolean | FileList | null;
export type FormValues = Record<string, FormValue>;

export interface FormOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface BaseFieldConfig {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  isVisible?: (values: FormValues) => boolean;
  validate?: (value: FormValue, values: FormValues) => string | undefined;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "tel" | "url" | "date";
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: string;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: FormOption[];
  placeholder?: string;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: FormOption[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  checkboxLabel: string;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
}

export type FormFieldConfig =
  | TextFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | FileFieldConfig;

export type FormErrors = Record<string, string>;
