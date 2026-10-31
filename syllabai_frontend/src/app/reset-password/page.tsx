"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, getApiErrorDescription } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { AccountRecoveryFrame } from "@/components/shared/AccountRecoveryFrame";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email") ?? "";
  const role = params.get("role") === "teacher" ? "teacher" : "student";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      toast.error("Email address is missing. Request a reset code again.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/v1/auth/password/reset/", {
        email,
        code,
        new_password: password,
      });

      toast.success("Password reset successfully", {
        description: "Sign in using your new password.",
      });

      router.replace(ROUTES[role].login);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Password reset failed.",
        { description: getApiErrorDescription(error) }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountRecoveryFrame
      role={role}
      title="Create a new password"
      description={<>Enter the reset code sent to <strong>{email || "your email"}</strong>, then choose a new password.</>}
      footer={<Link href={`/forgot-password?role=${role}&email=${encodeURIComponent(email)}`}>Request another reset code</Link>}
    >
      <form className="auth-recovery-form" onSubmit={submit}>
          <label className="field-label" htmlFor="reset-code">Reset code</label>
          <input
            id="reset-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            className="field-input"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />

          <label className="field-label" htmlFor="new-password">New password</label>
          <input
            id="new-password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="field-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className="field-label" htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="field-input"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button
            className="auth-recovery-submit"
            type="submit"
            disabled={loading || code.length !== 6 || !email}
          >
            {loading ? "Resetting password…" : "Reset password"}
            <span>↗</span>
          </button>
        </form>
    </AccountRecoveryFrame>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="auth-page">Loading…</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}