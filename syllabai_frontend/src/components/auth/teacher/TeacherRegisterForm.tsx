"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/shared/FormField";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";

export function TeacherRegisterForm() {
  const auth = useTeacherAuth();
  const [fields, setFields] = useState({ first_name: "", last_name: "", email: "", password: "" });
  function update(field: keyof typeof fields, value: string) { setFields((current) => ({ ...current, [field]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void auth.register(fields); }
  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field-row">
        <FormField id="teacher-first-name" label="First name" name="first_name" autoComplete="given-name" placeholder="Jordan" required value={fields.first_name} onChange={(event) => update("first_name", event.target.value)} />
        <FormField id="teacher-last-name" label="Last name" name="last_name" autoComplete="family-name" placeholder="Lee" required value={fields.last_name} onChange={(event) => update("last_name", event.target.value)} />
      </div>
      <FormField id="teacher-register-email" label="Work email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" required value={fields.email} onChange={(event) => update("email", event.target.value)} />
      <FormField id="teacher-register-password" label="Create a password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required value={fields.password} onChange={(event) => update("password", event.target.value)} />
      <button className="primary-button" type="submit" disabled={auth.loading}>{auth.loading ? "Creating your space…" : "Create educator account"}<span>↗</span></button>
    </form>
  );
}
