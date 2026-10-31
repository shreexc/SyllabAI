import Link from "next/link";

export default function LoginChoicePage() {
  return (
    <main className="get-started-page">
      <header className="get-started-header">
        <Link href="/" className="get-started-brand login-choice-brand" aria-label="SyllabAI home">
          <span className="get-started-brand-mark login-choice-brand-mark">S</span>
          <span>SyllabAI</span>
        </Link>
      </header>

      <section className="get-started-content" aria-labelledby="login-choice-title">
        <div className="get-started-hero">
          <svg className="get-started-sparkles" viewBox="0 0 64 72" aria-hidden="true">
            <path d="M25 4c0 12-9 21-21 21 12 0 21 9 21 21 0-12 9-21 21-21C34 25 25 16 25 4Z" />
            <path d="M50 39c0 7-5 12-12 12 7 0 12 5 12 12 0-7 5-12 12-12-7 0-12-5-12-12Z" />
          </svg>
          <h1 id="login-choice-title">Welcome Back to<br /><span>SyllabAI</span></h1>
          <svg className="get-started-art" viewBox="0 0 220 180" role="img" aria-label="A sparkling star above a stack of books">
            <defs>
              <linearGradient id="login-choice-blue" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#829cff" />
                <stop offset="1" stopColor="#4263e8" />
              </linearGradient>
              <linearGradient id="login-choice-purple" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#c99af3" />
                <stop offset="1" stopColor="#8861e9" />
              </linearGradient>
            </defs>
            <path d="m19 37 31-8 9 39-31 8z" fill="#ddd4ff" />
            <path d="m26 44 17-4M29 52l19-5M31 61l20-5" fill="none" stroke="#9c83ee" strokeLinecap="round" strokeWidth="2" />
            <path d="M116 14c0 13-9 22-22 22 13 0 22 9 22 22 0-13 9-22 22-22-13 0-22-9-22-22Z" fill="url(#login-choice-purple)" />
            <path d="M116 22c0 8-6 14-14 14 8 0 14 6 14 14 0-8 6-14 14-14-8 0-14-6-14-14Z" fill="#f3edff" />
            <path d="m64 88 47-15 61 16-48 17z" fill="#7565e8" />
            <path d="m64 88 60 18v13L64 103z" fill="url(#login-choice-blue)" />
            <path d="m124 106 48-17v13l-48 17z" fill="#b6a8ff" />
            <path d="m54 115 58-15 72 18-59 17z" fill="#a38af0" />
            <path d="m54 115 71 20v13l-71-20z" fill="#e5d7ff" />
            <path d="m125 135 59-17v13l-59 17z" fill="#8771e8" />
            <path d="m42 141 69-17 74 18-69 19z" fill="#4d6bef" />
            <path d="m42 141 74 20v12l-74-19z" fill="url(#login-choice-blue)" />
            <path d="m116 161 69-19v12l-69 19z" fill="#8aa7ff" />
            <path d="m165 47 20-23 8 6-20 23z" fill="#8f7af0" />
            <path d="m165 47 8 6-6 7-8-6z" fill="#d4c4ff" />
            <path d="M80 57c4-7 10-10 17-8M145 66c8 2 14-1 18-7" fill="none" stroke="#b09af8" strokeLinecap="round" strokeWidth="2" />
            <path d="M76 22c0 4-3 7-7 7 4 0 7 3 7 7 0-4 3-7 7-7-4 0-7-3-7-7Z" fill="#7fa7ff" />
            <path d="M196 47c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z" fill="#9277ef" />
            <circle cx="40" cy="111" r="6" fill="#7793ff" />
          </svg>
        </div>

        <nav className="get-started-roles" aria-label="Choose your account type to sign in">
          <Link href="/teacher/login" className="get-started-role">
            <span className="get-started-role-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 5h16v13H4zM7 8h4M7 11h2m4-2h4m-4 3h4M8 18v2m8-2v2M6 20h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                <circle cx="16" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span>As a teacher</span>
            <span className="get-started-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/student/login" className="get-started-role">
            <span className="get-started-role-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m2 9 10-5 10 5-10 5L2 9Zm4 2.2 6 3 6-3V16c-3.5 3.2-8.5 3.2-12 0v-4.8ZM21 10v6h-1v-6h1Z" />
              </svg>
            </span>
            <span>As a student</span>
            <span className="get-started-arrow" aria-hidden="true">→</span>
          </Link>
        </nav>
      </section>

      <footer className="get-started-footer">
        New to SyllabAI? <Link href="/register">Get started</Link>
      </footer>
    </main>
  );
}
