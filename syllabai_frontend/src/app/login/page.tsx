import Link from "next/link";

export default function LoginChoicePage() {
  return (
    <main className="choice-page">
      <Link href="/" className="brand-lockup"><span className="brand-mark">s.</span><span>SyllabAI</span></Link>
      <section className="choice-content">
        <span className="eyebrow"><span className="eyebrow-dot" /> A SPACE FOR LEARNING</span>
        <h1>How do you use<br /><em>SyllabAI?</em></h1>
        <p>Choose your space to continue.</p>
        <div className="choice-grid">
          <Link href="/teacher/login" className="choice-card"><span className="choice-icon">✳</span><strong>I teach</strong><span>Plan and shape meaningful learning.</span><span className="choice-arrow">↗</span></Link>
          <Link href="/student/login" className="choice-card choice-card--student"><span className="choice-icon">✦</span><strong>I’m learning</strong><span>Explore, practice, and grow your way.</span><span className="choice-arrow">↗</span></Link>
        </div>
        <p className="choice-footer">New here? <Link href="/">Explore SyllabAI</Link></p>
      </section>
    </main>
  );
}
