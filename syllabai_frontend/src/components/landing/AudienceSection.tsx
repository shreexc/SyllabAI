import Link from "next/link";

const audiences = [
  {
    role: "For Students",
    title: "Active learning built around your pace.",
    description:
      "Turn long readings into concise study materials, check your understanding, and revisit key ideas when it suits you.",
    benefits: [
      "Spaced active recall with instant feedback",
      "Focused, distraction-free reading notes",
      "Visual diagrams for complex mechanisms",
      "Private tracking of your study progress",
    ],
    href: "/student/register",
    cta: "Start learning",
    tone: "student",
  },
  {
    role: "For Teacher",
    title: "Spend less time formatting, more time teaching.",
    description:
      "Turn course materials into ready-to-share study resources that help your learners stay focused on the ideas.",
    benefits: [
      "Fast quiz creation from course texts",
      "Concise lecture notes and key terms",
      "Visual storyboards for classroom learning",
      "Source-grounded outputs you can review",
    ],
    href: "/teacher/register",
    cta: "Explore teaching tools",
    tone: "teacher",
  },
];

export function AudienceSection() {
  return (
    <section className="landing-section landing-audience" aria-label="For students and teachers">
      <div className="section-container roles-split-grid">
        {audiences.map((audience) => (
          <article className={`role-showcase role-showcase--${audience.tone}`} key={audience.role}>
            <span className="role-badge">{audience.role}</span>
            <h2>{audience.title}</h2>
            <p>{audience.description}</p>
            <ul className="role-feature-list">
              {audience.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
            </ul>
            <Link href={audience.href} className="role-cta-btn">
              {audience.cta}<span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
