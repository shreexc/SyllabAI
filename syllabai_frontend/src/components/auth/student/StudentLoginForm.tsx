"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/shared/FormField";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export function StudentLoginForm() {
  const auth = useStudentAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void auth.login({ email, password });
  }
  return (
    <form className="auth-form" onSubmit={submit}>
      <FormField id="student-email" label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <FormField id="student-password" label="Password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      <button className="primary-button" type="submit" disabled={auth.loading}>{auth.loading ? "Signing you in…" : "Sign in as a learner"}<span>↗</span></button>
    </form>
  );
}
