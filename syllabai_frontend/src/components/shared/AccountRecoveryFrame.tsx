import Link from "next/link";
import type { ReactNode } from "react";
import type { UserRole } from "@/types/auth";
import { AuthStudyIllustration } from "./AuthStudyIllustration";

interface AccountRecoveryFrameProps {
  role: UserRole;
  title: string;
  description: ReactNode;
  storyDescription?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function AccountRecoveryFrame({
  role,
  title,
  description,
  storyDescription = "Regain access to your SyllabAI space and get back to what matters.",
  footer,
  children,
}: AccountRecoveryFrameProps) {
  return (
    <main className="auth-recovery-page">
      <header className="auth-recovery-header">
        <Link href="/" className="get-started-brand login-choice-brand" aria-label="SyllabAI home">
          <span className="get-started-brand-mark login-choice-brand-mark">S</span>
          <span>SyllabAI</span>
        </Link>
      </header>

      <section className="auth-recovery-layout">
        <aside className="auth-recovery-story">
          <span className="auth-recovery-eyebrow">{role === "teacher" ? "TEACHING SPACE" : "LEARNING SPACE"}</span>
          <h1>Every new day<br /><em>starts fresh.</em></h1>
          <p>{storyDescription}</p>
          <div className="auth-recovery-art">
            <AuthStudyIllustration />
          </div>
        </aside>

        <section className="auth-recovery-card" aria-labelledby="auth-recovery-title">
          <span className="auth-recovery-card-kicker">ACCOUNT RECOVERY</span>
          <h2 id="auth-recovery-title">{title}</h2>
          <p className="auth-recovery-description">{description}</p>
          {children}
          <div className="auth-recovery-footer">{footer}</div>
          <div className="auth-recovery-assurance">
            <span aria-hidden="true">⌑</span>
            Your learning space is private and secure.
          </div>
        </section>
      </section>

      <footer className="auth-recovery-bottom">© 2026 SyllabAI <span>Built for curious minds</span></footer>
    </main>
  );
}
