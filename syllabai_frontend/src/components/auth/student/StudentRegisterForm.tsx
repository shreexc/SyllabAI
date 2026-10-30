"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/shared/FormField";
import { PasswordField } from "@/components/shared/PasswordField";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export function StudentRegisterForm() {
  const auth = useStudentAuth();
  const [fields, setFields] = useState({ first_name: "", last_name: "", email: "", password: "" });
  function update(field: keyof typeof fields, value: string) { setFields((current) => ({ ...current, [field]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void auth.register(fields); }
  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field-row">
        <FormField id="student-first-name" label="First name" name="first_name" autoComplete="given-name" required value={fields.first_name} onChange={(event) => update("first_name", event.target.value)} />
        <FormField id="student-last-name" label="Last name" name="last_name" autoComplete="family-name" required value={fields.last_name} onChange={(event) => update("last_name", event.target.value)} />
      </div>
      <div className="register-email-field">
        <FormField id="student-register-email" label="Email address" name="email" type="email" autoComplete="email" required value={fields.email} onChange={(event) => update("email", event.target.value)} />
        <svg className="register-email-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3" />
          <path d="M5.5 19c.6-3 2.8-4.5 6.5-4.5s5.9 1.5 6.5 4.5z" />
        </svg>
      </div>
      <PasswordField id="student-register-password" label="Create a password" name="password" value={fields.password} onChange={(event) => update("password", event.target.value)} autoComplete="new-password" minLength={8} />
      <button className="primary-button" type="submit" disabled={auth.loading}>{auth.loading ? "Setting things up…" : "Create student account"}<span>↗</span></button>
    </form>
  );
}
