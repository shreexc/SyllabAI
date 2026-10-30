"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FormField } from "@/components/shared/FormField";
import { PasswordField } from "@/components/shared/PasswordField";
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
      <FormField id="teacher-email" label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <PasswordField id="teacher-password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <div className="forgot-password-row">
        <Link
          href={`/forgot-password?role=teacher&email=${encodeURIComponent(email)}`}
          className="quiet-link"
        >
          Forgot password?
        </Link>
      </div>
      <button className="primary-button" type="submit" disabled={auth.loading}>{auth.loading ? "Signing you in…" : "Sign in"}</button>
    </form>
  );
}
