import Link from "next/link";
import { LandingIcon, type LandingIconName } from "./LandingIcon";

const formats: {
  title: string;
  tagline: string;
  description: string;
  cta: string;
  href: string;
  icon: LandingIconName;
  tone: string;
}[] = [
  {
    title: "Quiz",
    tagline: "Test your understanding.",
    description: "Practice with questions drawn directly from your learning material.",
    cta: "Explore Quizzes",
    href: "/student/quizzes",
    icon: "quiz",
    tone: "pink",
  },
  {
    title: "Flash Cards",
    tagline: "Memorize important concepts.",
    description: "Build active recall with prompts and answers based on your notes.",
    cta: "Explore Notes",
    href: "/student/flashcards",
    icon: "cards",
    tone: "blue",
  },
  {
    title: "AI buddy",
    tagline: "Get a little help with your studies.",
    description: "Find a fresh way into a difficult topic with your learning material.",
    cta: "Explore AI Buddy",
    href: "/student/prepare",
    icon: "buddy",
    tone: "yellow",
  },
  {
    title: "Animation",
    tagline: "Understand processes visually.",
    description: "Follow complex mechanisms as clear, digestible visual steps.",
    cta: "Explore Animation",
    href: "/student/animations",
    icon: "animation",
    tone: "green",
  },
];

export function FormatsSection() {
  return (
    <section className="landing-section landing-formats" aria-labelledby="formats-title">
      <div className="section-container">
        <h2 className="landing-section-title" id="formats-title">
          Study in the format that works for you
        </h2>
        <div className="formats-grid">
          {formats.map((format) => (
            <article className="format-card" key={format.title}>
              <span className={`format-icon format-icon--${format.tone}`}>
                <LandingIcon name={format.icon} />
              </span>
              <h3>{format.title}</h3>
              <span className="format-tagline">{format.tagline}</span>
              <p className="format-description">{format.description}</p>
              <Link className="format-cta" href={format.href}>
                {format.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
