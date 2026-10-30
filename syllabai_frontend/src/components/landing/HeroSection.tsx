import { LandingIcon } from "./LandingIcon";

export function HeroSection() {
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="hero-copy">
        <span className="eyebrow hero-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true">✦</span>
          Source-grounded learning platform
        </span>
        <h1 id="landing-title">
          Turn your learning
          <br />
          material into <em>smarter</em>
          <br />
          study tools.
        </h1>
      </div>

      <div
        className="hero-art"
        role="img"
        aria-label="SyllabAI learning hub with quizzes, notes, flashcards, diagrams, and animation"
      >
        <div className="hero-art-orbit hero-art-orbit--outer" />
        <div className="hero-art-orbit hero-art-orbit--inner" />
        <span className="hero-art-star hero-art-star--one" aria-hidden="true">✦</span>
        <span className="hero-art-star hero-art-star--two" aria-hidden="true">✦</span>
        <span className="hero-art-star hero-art-star--three" aria-hidden="true">✦</span>
        <span className="hero-art-dot hero-art-dot--one" aria-hidden="true" />
        <span className="hero-art-dot hero-art-dot--two" aria-hidden="true" />
        <div className="hero-book-stack" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-art-ribbon" aria-hidden="true" />
        <div className="hero-art-card-back" aria-hidden="true" />
        <div className="hero-hub-card">
          <span className="hero-hub-kicker">SYLLABAI LEARNING HUB</span>
          <strong>Study smarter.</strong>
          <span className="hero-hub-underline" />
          <div className="hero-hub-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero-format-icons" aria-hidden="true">
            <span className="hero-format-icon hero-format-icon--quiz"><LandingIcon name="quiz" /></span>
            <span className="hero-format-icon hero-format-icon--cards"><LandingIcon name="cards" /></span>
            <span className="hero-format-icon hero-format-icon--buddy"><LandingIcon name="buddy" /></span>
            <span className="hero-format-icon hero-format-icon--animation"><LandingIcon name="animation" /></span>
          </div>
        </div>
        <span className="floating-chip floating-chip--one">
          <LandingIcon name="sparkles" /> 5 learning formats
        </span>
        <span className="floating-chip floating-chip--two">
          <LandingIcon name="check" /> verified source text
        </span>
      </div>
    </section>
  );
}
