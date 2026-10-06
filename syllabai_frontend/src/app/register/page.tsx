import Link from "next/link";

export default function RegisterChoicePage() {
  return (
    <main className="choice-page">
      <Link href="/" className="brand-lockup"><span className="brand-mark">s.</span><span>SyllabAI</span></Link>
      <section className="choice-content">
        <span className="eyebrow"><span className="eyebrow-dot" /> START YOUR JOURNEY</span>
        <h1>Choose your<br /><em>learning space.</em></h1>
        <p>Every great learning experience starts somewhere.</p>
        <div className="choice-grid">
          <Link href="/teacher/register" className="choice-card"><span className="choice-icon">✳</span><strong>I’m an educator</strong><span>Create a home for your teaching.</span><span className="choice-arrow">↗</span></Link>
          <Link href="/student/register" className="choice-card choice-card--student"><span className="choice-icon">✦</span><strong>I’m a learner</strong><span>Make room for your next discovery.</span><span className="choice-arrow">↗</span></Link>
        </div>
        <p className="choice-footer">Already with us? <Link href="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
