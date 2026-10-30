"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/shared/FormField";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";

export function TeacherRegisterForm() {
  const auth = useTeacherAuth();
  const [fields, setFields] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  function update(field: keyof typeof fields, value: string) { setFields((current) => ({ ...current, [field]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void auth.register(fields); }
  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field-row">
        <FormField id="teacher-first-name" label="First name" name="first_name" autoComplete="given-name" placeholder="Jordan" required value={fields.first_name} onChange={(event) => update("first_name", event.target.value)} />
        <FormField id="teacher-last-name" label="Last name" name="last_name" autoComplete="family-name" placeholder="Lee" required value={fields.last_name} onChange={(event) => update("last_name", event.target.value)} />
      </div>
      <FormField id="teacher-register-email" label="Work email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" required value={fields.email} onChange={(event) => update("email", event.target.value)} />
      <div className="password-field">
        <FormField id="teacher-register-password" label="Create a password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required value={fields.password} onChange={(event) => update("password", event.target.value)} />
        <button className="password-visibility" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z" />
            <circle cx="12" cy="12" r="2.4" />
            {showPassword && <path d="m4 4 16 16" />}
          </svg>
        </button>
      </div>
      <button className="primary-button" type="submit" disabled={auth.loading}>{auth.loading ? "Creating your space…" : "Create teacher account"}<span>↗</span></button>
    </form>
  );
}
