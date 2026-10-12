"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, getApiErrorDescription } from "@/lib/api";
import { ROUTES } from "@/lib/constants";

function ForgotPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const role = params.get("role") === "teacher" ? "teacher" : "student";

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/v1/auth/password/forgot/", { email });

      toast.success("Check your email", {
        description: "If your account is eligible, a reset code will be sent.",
      });

      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&role=${role}`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not request a reset code.",
        { description: getApiErrorDescription(error) }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="card-kicker">Account recovery</div>
        <h2>Forgot your password?</h2>
        <p className="card-subtitle">
          Enter your registered email address to request a password-reset code.
        </p>

        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="reset-email">Email address</label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Requesting code…" : "Send reset code"}
            <span>↗</span>
          </button>
        </form>

        <p className="card-subtitle">
          Remembered your password?{" "}
          <Link href={ROUTES[role].login}>Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<main className="auth-page">Loading…</main>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}