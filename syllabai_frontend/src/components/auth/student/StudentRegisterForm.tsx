"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/shared/FormField";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export function StudentRegisterForm() {
  const auth = useStudentAuth();
  const [fields, setFields] = useState({ first_name: "", last_name: "", email: "", password: "" });
  function update(field: keyof typeof fields, value: string) { setFields((current) => ({ ...current, [field]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void auth.register(fields); }
  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field-row">
        <FormField id="student-first-name" label="First name" name="first_name" autoComplete="given-name" placeholder="Alex" required value={fields.first_name} onChange={(event) => update("first_name", event.target.value)} />
        <FormField id="student-last-name" label="Last name" name="last_name" autoComplete="family-name" placeholder="Rivera" required value={fields.last_name} onChange={(event) => update("last_name", event.target.value)} />
      </div>
      <FormField id="student-register-email" label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={fields.email} onChange={(event) => update("email", event.target.value)} />
      <FormField id="student-register-password" label="Create a password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required value={fields.password} onChange={(event) => update("password", event.target.value)} />
      <button className="primary-button" type="submit" disabled={auth.loading}>{auth.loading ? "Setting things up…" : "Create learner account"}<span>↗</span></button>
    </form>
  );
}
