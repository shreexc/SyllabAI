"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, getApiErrorDescription } from "@/lib/api";
import { ROUTES } from "@/lib/constants";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";
  const role = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      toast.error("Email address is missing. Please register again.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/v1/auth/email/verify/", {
        email,
        code,
      });

      toast.success("Email verified successfully", {
        description: "You can now sign in.",
      });

      router.replace(ROUTES[role].login);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification failed.",
        { description: getApiErrorDescription(error) }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="card-kicker">SyllabAI account</div>
        <h2>Verify your email</h2>
        <p className="card-subtitle">
          Enter the six-digit code sent to <strong>{email || "your email"}</strong>.
        </p>

        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="verification-code">Verification code</label>
          <input
            id="verification-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />

          <button
            className="primary-button"
            type="submit"
            disabled={loading || code.length !== 6 || !email}
          >
            {loading ? "Verifying…" : "Verify email"}
            <span>↗</span>
          </button>
        </form>

        <p className="card-subtitle">
          Already verified?{" "}
          <Link href={ROUTES[role].login}>Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="auth-page">Loading verification…</main>}>
      <VerifyEmailForm />
    </Suspense>
  );
}