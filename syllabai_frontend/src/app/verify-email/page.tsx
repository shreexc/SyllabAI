"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, getApiErrorDescription } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { AccountRecoveryFrame } from "@/components/shared/AccountRecoveryFrame";

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
    <AccountRecoveryFrame
      role={role}
      title="Verify your email"
      description={<>Enter the six-digit code sent to <strong>{email || "your email"}</strong> to activate your account.</>}
      storyDescription="Verify your email and get started with your SyllabAI space."
      footer={<>Already verified? <Link href={ROUTES[role].login}>Sign in</Link></>}
    >
      <form className="auth-recovery-form" onSubmit={submit}>
          <label className="field-label" htmlFor="verification-code">Verification code</label>
          <input
            id="verification-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            className="field-input auth-verification-code"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />

          <button
            className="auth-recovery-submit"
            type="submit"
            disabled={loading || code.length !== 6 || !email}
          >
            {loading ? "Verifying…" : "Verify email"}
            <span>↗</span>
          </button>
      </form>
    </AccountRecoveryFrame>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="auth-recovery-page">Loading verification…</main>}>
      <VerifyEmailForm />
    </Suspense>
  );
}