import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="get-started-page">
      <header className="get-started-header">
        <Link href="/" className="get-started-brand" aria-label="SyllabAI home">
          <span className="get-started-brand-mark">S</span>
          <span>SyllabAI</span>
        </Link>
      </header>

      <section className="get-started-content" aria-labelledby="get-started-title">
        <div className="get-started-hero">
          <svg className="get-started-sparkles" viewBox="0 0 64 72" aria-hidden="true">
            <path d="M25 4c0 12-9 21-21 21 12 0 21 9 21 21 0-12 9-21 21-21C34 25 25 16 25 4Z" />
            <path d="M50 39c0 7-5 12-12 12 7 0 12 5 12 12 0-7 5-12 12-12-7 0-12-5-12-12Z" />
          </svg>
          <h1 id="get-started-title">Get Started with<br /><span>SyllabAI</span></h1>
          <Image
            className="get-started-art"
            src="/images/get-started-books.png"
            alt="A sparkling star above a stack of books"
            width={701}
            height={477}
            priority
          />
        </div>

        <nav className="get-started-roles" aria-label="Choose your account type">
          <Link href="/teacher/register" className="get-started-role">
            <span className="get-started-role-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 5h16v13H4zM7 8h4M7 11h2m4-2h4m-4 3h4M8 18v2m8-2v2M6 20h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                <circle cx="16" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span>As a teacher</span>
            <span className="get-started-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/student/register" className="get-started-role">
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

      <footer className="get-started-footer">SyllabAI by Syllabi</footer>
    </main>
  );
}
