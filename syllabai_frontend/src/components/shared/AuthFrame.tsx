import Link from "next/link";
import type { ReactNode } from "react";
import type { UserRole } from "@/types/auth";
import { AuthStudyIllustration } from "./AuthStudyIllustration";

interface AuthFrameProps {
  role: UserRole;
  mode: "login" | "register";
  children: ReactNode;
}

const roleLabel = { teacher: "Educator", student: "Learner" } as const;

export function AuthFrame({ role, mode, children }: AuthFrameProps) {
  const otherRole = role === "teacher" ? "student" : "teacher";
  const title = mode === "login" ? "Welcome back" : "Create your account";
  return (
    <main className={`auth-page auth-page--${role}${mode === "login" ? " auth-page--login" : ""}`}>
      <div className="auth-orbit auth-orbit--one" />
      <div className="auth-orbit auth-orbit--two" />
      <header className={`auth-topbar${mode === "login" ? " auth-topbar--login" : ""}`}>
        <Link href="/" className="brand-lockup"><span className="brand-mark">S</span><span>SyllabAI</span></Link>
        {mode === "register" && (
          <Link className="quiet-link" href={`/${otherRole}/${mode}`}>Joining as a {roleLabel[otherRole].toLowerCase()}?</Link>
        )}
      </header>
      <section className="auth-layout">
        <aside className="auth-story">
          {mode === "login" ? (
            <>
              <h1>Small steps.<br /><em>Big discoveries.</em></h1>
              <p>Your notes, ideas, and next breakthrough - together in one calm place.</p>
              <AuthStudyIllustration />
            </>
          ) : (
            <>
              <span className="eyebrow"><span className="eyebrow-dot" /> YOUR LEARNING SPACE</span>
              <h1>{role === "teacher" ? <>Make every lesson<br /><em>go further.</em></> : <>Small steps.<br /><em>Big discoveries.</em></>}</h1>
              <p>{role === "teacher" ? "A thoughtful home for your teaching practice. Your next great lesson starts here." : "Your notes, ideas, and next breakthrough—together in one calm place."}</p>
              <div className="story-note"><span className="story-note-icon">✳</span><span>{role === "teacher" ? "Teach with clarity. Inspire with confidence." : "Learn at your pace. Find your own way."}</span></div>
            </>
          )}
        </aside>
        <div className={`auth-card${mode === "login" ? " auth-card--login" : ""}`}>
          {mode === "register" && <div className="card-kicker">{roleLabel[role]} account</div>}
          <h2>{title}</h2>
          {mode === "register" && <p className="card-subtitle">A few details and you’re ready to begin.</p>}
          {children}
          <div className="auth-switch">
            {mode === "login" ? "New to SyllabAI?" : "Already have an account?"}{" "}
            <Link href={`/${role}/${mode === "login" ? "register" : "login"}`}>
              {mode === "login" ? "Create an account" : "Sign in"}
            </Link>
          </div>
          <div className="auth-assurance"><span aria-hidden="true">⌑</span> Your learning space is private and secure.</div>
        </div>
      </section>
      {mode === "register" && <footer className="auth-footer"><span>© 2026 SyllabAI</span><span>Built for curious minds</span></footer>}
    </main>
  );
}
