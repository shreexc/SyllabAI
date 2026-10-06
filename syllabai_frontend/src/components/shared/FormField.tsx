import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function FormField({ label, hint, id, ...inputProps }: FormFieldProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <input className="field-input" id={id} {...inputProps} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
