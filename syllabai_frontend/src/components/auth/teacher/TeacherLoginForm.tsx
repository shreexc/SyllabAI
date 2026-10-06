"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/shared/FormField";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";

export function TeacherLoginForm() {
  const auth = useTeacherAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void auth.login({ email, password });
  }
  return (
    <form className="auth-form" onSubmit={submit}>
      <FormField id="teacher-email" label="Work email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <FormField id="teacher-password" label="Password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      <button className="primary-button" type="submit" disabled={auth.loading}>{auth.loading ? "Signing you in…" : "Sign in as an educator"}<span>↗</span></button>
    </form>
  );
}
