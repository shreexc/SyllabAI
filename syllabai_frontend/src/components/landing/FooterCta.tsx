import Link from "next/link";

export function FooterCta() {
  return (
    <section className="landing-section landing-final-cta" aria-labelledby="final-cta-title">
      <div className="section-container final-cta-box">
        <h2 id="final-cta-title">Ready to transform the way you study?</h2>
        <p>Join students and educators using SyllabAI to create smarter, connected study tools today.</p>
        <div className="final-cta-actions">
          <Link href="/student/register" className="hero-button">
            Start Learning Free <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/teacher/register" className="hero-secondary-btn">
            Educator Registration <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
