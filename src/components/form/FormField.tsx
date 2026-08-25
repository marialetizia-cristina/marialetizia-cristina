import type { FormFieldConfig, FormValue } from "./types";
import { CheckboxInput } from "./CheckboxInput";
import { FileInput } from "./FileInput";
import { RadioGroup } from "./RadioGroup";
import { SelectInput } from "./SelectInput";
import { TextareaInput } from "./TextareaInput";
import { TextInput } from "./TextInput";

interface FormFieldProps {
  field: FormFieldConfig;
  value: FormValue;
  error?: string;
  onChange: (value: FormValue) => void;
}

export function FormField({ field, value, error, onChange }: FormFieldProps) {
  switch (field.type) {
    case "textarea":
      return <TextareaInput {...field} value={typeof value === "string" ? value : ""} error={error} onChange={onChange} />;
    case "select":
      return <SelectInput {...field} value={typeof value === "string" ? value : ""} error={error} onChange={onChange} />;
    case "radio":
      return <RadioGroup {...field} value={typeof value === "string" ? value : ""} error={error} onChange={onChange} />;
    case "checkbox":
      return <CheckboxInput {...field} value={typeof value === "boolean" ? value : false} error={error} onChange={onChange} />;
    case "file":
      return <FileInput {...field} error={error} onChange={onChange} />;
    default:
      return <TextInput {...field} value={typeof value === "string" ? value : ""} error={error} onChange={onChange} />;
  }
}
