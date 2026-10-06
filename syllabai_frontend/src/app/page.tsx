import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavigation } from "@/components/shared/LandingNavigation";

export const metadata: Metadata = {
  title: "SyllabAI — Turn Your Learning Material into Smarter Study Tools",
  description:
    "Upload or search your study material and transform it into short notes, quizzes, flashcards, images, and educational animations with source-grounded AI.",
  openGraph: {
    title: "SyllabAI — Smarter Study Tools from Your Material",
    description:
      "Transform PDFs, notes, and documents into interactive quizzes, flashcards, concise summaries, and animations.",
    type: "website",
  },
};

const learningFormats = [
  {
    icon: "✦",
    title: "Quiz",
    tagline: "Test your understanding.",
    description:
      "Generate multiple-choice, true/false, and fill-in-the-blank questions derived directly from your learning materials.",
    example: "“Which valve prevents backflow into the right ventricle?”",
    cta: "Explore Quizzes",
    href: "/student/register",
    tone: "peach",
  },
  {
    icon: "▤",
    title: "Short Notes",
    tagline: "Get concise study material.",
    description:
      "Extract structured key takeaways, essential concept summaries, and defined terminology without filler.",
    example: "Key terms: SA Node, AV Node, Pulmonary Circulation.",
    cta: "Explore Notes",
    href: "/student/register",
    tone: "mint",
  },
  {
    icon: "▱",
    title: "Flashcards",
    tagline: "Memorize important concepts.",
    description:
      "Build interactive active-recall decks with prompt and reveal answers to master core facts and vocabulary.",
    example: "Prompt: What does the source explain about Sinoatrial Node?",
    cta: "Explore Flashcards",
    href: "/student/register",
    tone: "lavender",
  },
  {
    icon: "▧",
    title: "Images",
    tagline: "Visualize difficult concepts.",
    description:
      "Render source-grounded educational SVG diagrams, infographics, and extracted figures for visual learners.",
    example: "Diagram: Multi-chamber circulatory flow with labeled nodes.",
    cta: "Explore Visuals",
    href: "/student/register",
    tone: "mint",
  },
  {
    icon: "▷",
    title: "Animation",
    tagline: "Understand processes visually.",
    description:
      "Follow sequenced educational storyboard scenes that break complex mechanisms into digestible visual steps.",
    example: "Scene 1: Oxygen absorption → Scene 2: Arterial delivery.",
    cta: "Explore Animations",
    href: "/student/register",
    tone: "blue",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Search or Upload",
    description:
      "Upload your PDF, Word document, text file, or image — or search your personal private library of materials.",
    icon: "⬆",
  },
  {
    step: "02",
    title: "Choose What to Prepare",
    description:
      "Select Quiz, Short Notes, Flashcards, Diagrams, or Animation based on how you learn best.",
    icon: "✧",
  },
  {
    step: "03",
    title: "Let SyllabAI Process",
    description:
      "Our backend securely extracts text, chunks key concepts, and retrieves grounded context with RAG.",
    icon: "⚙",
  },
  {
    step: "04",
    title: "Study the Result",
    description:
      "Take interactive quizzes, flip flashcards, read structured notes, and navigate between connected tools.",
    icon: "✓",
  },
];

const faqs = [
  {
    question: "How does SyllabAI ensure accuracy?",
    answer:
      "SyllabAI uses source-grounded retrieval. Generated questions, notes, and flashcards are derived from your uploaded documents rather than ungrounded AI predictions.",
  },
  {
    question: "What file formats can I upload?",
    answer:
      "You can upload PDFs, text files (.txt), Word documents (.docx), and common image files (.png, .jpeg).",
  },
  {
    question: "Is there a difference between Teacher and Student accounts?",
    answer:
      "Yes. Teachers have educator toolkits for preparing teaching materials and sharing resources, while students have personalized study dashboards, active recall review, and quiz attempts.",
  },
  {
    question: "Are my study materials private?",
    answer:
      "Yes. All uploaded files, extracted texts, and generated study materials are strictly scoped to your private account and protected with role-based access control.",
  },
];

export default function Home() {
  return (
    <main className="landing-page">
      <LandingNavigation />

      {/* Hero Section */}
      <section className="landing-hero" aria-label="Hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> SOURCE-GROUNDED LEARNING PLATFORM
          </span>
          <h1>
            Turn your learning material into <em>smarter</em> study tools.
          </h1>
          <p>
            Upload or search your study material and transform it into short notes, quizzes, flashcards, images, and educational animations with AI.
          </p>
          <div className="hero-actions">
            <Link href="/student/register" className="hero-button">
              Start Learning <span>↗</span>
            </Link>
            <Link href="/teacher/register" className="hero-secondary-btn">
              For Teachers <span>→</span>
            </Link>
          </div>
          <div className="hero-caption">
            <span className="caption-stars">✳ ✦ ✳</span> Grounded directly in your source documents.
          </div>
        </div>

        <div className="hero-art" aria-label="Learning illustration">
          <div className="art-glow" />
          <div className="art-card art-card--back">
            <span className="art-line art-line--short" />
            <span className="art-line" />
            <span className="art-line art-line--mid" />
            <span className="art-stamp">✦</span>
          </div>
          <div className="art-card art-card--front">
            <span className="art-card-label">SYLLABAI LEARNING HUB</span>
            <span className="art-title">Study smarter.</span>
            <span className="art-underline" />
            <span className="art-small-line" />
            <span className="art-small-line art-small-line--short" />
            <span className="art-doodle">✳</span>
          </div>
          <span className="floating-chip floating-chip--one">5 learning formats</span>
          <span className="floating-chip floating-chip--two">✦ verified source text</span>
          <span className="hero-orbit hero-orbit--large" />
          <span className="hero-orbit hero-orbit--small" />
        </div>
      </section>

      {/* How SyllabAI Works */}
      <section className="landing-section landing-how-it-works" aria-label="How it works">
        <div className="section-container">
          <div className="section-intro">
            <span className="eyebrow">A CLEAR, TRANSPARENT WORKFLOW</span>
            <h2>How SyllabAI works</h2>
            <p>From your original document to interactive learning tools in four simple steps.</p>
          </div>
          <div className="how-it-works-grid">
            {howItWorks.map((item) => (
              <div key={item.step} className="how-step-card">
                <div className="how-step-header">
                  <span className="how-step-number">{item.step}</span>
                  <span className="how-step-icon">{item.icon}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Learning Formats Section */}
      <section className="landing-section landing-formats" aria-label="Learning formats">
        <div className="section-container">
          <div className="section-intro">
            <span className="eyebrow">FIVE WAYS TO UNDERSTAND</span>
            <h2>Study in the format that works for you</h2>
            <p>Every student learns differently. SyllabAI lets you switch between formats instantly.</p>
          </div>
          <div className="formats-grid">
            {learningFormats.map((format) => (
              <div key={format.title} className="format-card">
                <span className={`format-icon format-icon--${format.tone}`}>{format.icon}</span>
                <h3>{format.title}</h3>
                <span className="format-tagline">{format.tagline}</span>
                <p className="format-description">{format.description}</p>
                <div className="format-example">
                  <span className="format-example-label">Preview:</span>
                  <p>{format.example}</p>
                </div>
                <Link href={format.href} className="format-cta">
                  {format.cta} <span>↗</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students & Teachers */}
      <section className="landing-section landing-roles-section" aria-label="For students and teachers">
        <div className="section-container">
          <div className="roles-split-grid">
            <div className="role-showcase role-showcase--student">
              <span className="role-badge">FOR STUDENTS</span>
              <h3>Active learning built around your pace.</h3>
              <p>
                Turn long readings into bite-sized summaries, test your comprehension before exams with quizzes, and reinforce retention with spaced flashcard reviews.
              </p>
              <ul className="role-feature-list">
                <li>✓ Spaced active recall with instant feedback</li>
                <li>✓ Focused, distraction-free reading notes</li>
                <li>✓ Visual diagrams for complex mechanisms</li>
                <li>✓ Private tracking of your study progress</li>
              </ul>
              <Link href="/student/register" className="role-cta-btn">
                Start as a Learner <span>↗</span>
              </Link>
            </div>

            <div className="role-showcase role-showcase--teacher">
              <span className="role-badge">FOR EDUCATORS</span>
              <h3>Spend less time formatting, more time teaching.</h3>
              <p>
                Convert textbooks, lecture slides, and syllabus documents into ready-to-share quizzes, classroom flashcards, and illustrated study sheets in minutes.
              </p>
              <ul className="role-feature-list">
                <li>✓ Fast quiz question creation from course texts</li>
                <li>✓ Concise lecture notes and key term glossaries</li>
                <li>✓ Storyboard animations for visual classroom lessons</li>
                <li>✓ Reliable, source-grounded outputs you can trust</li>
              </ul>
              <Link href="/teacher/register" className="role-cta-btn">
                Set up Teaching Space <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI + RAG Architecture */}
      <section className="landing-section landing-rag" aria-label="AI and RAG explanation">
        <div className="section-container">
          <div className="rag-card">
            <span className="eyebrow">INTELLIGENT GROUNDING</span>
            <h2>Grounded in your material. Never hallucinated.</h2>
            <p>
              Unlike generic chatbots that make up plausible-sounding answers, SyllabAI uses Retrieval-Augmented Generation (RAG) to ensure that every question, answer, note point, and flashcard traces back directly to your uploaded document.
            </p>
            <div className="rag-badges">
              <span className="rag-pill">📄 Source-Extracted Text</span>
              <span className="rag-pill">🔍 Vector Chunk Retrieval</span>
              <span className="rag-pill">🛡 Verifiable Accuracy</span>
              <span className="rag-pill">🔒 Private & Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section landing-faq" aria-label="Frequently asked questions">
        <div className="section-container">
          <div className="section-intro">
            <span className="eyebrow">COMMON QUESTIONS</span>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq-grid">
            {faqs.map((faq) => (
              <div key={faq.question} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section landing-final-cta" aria-label="Get started">
        <div className="section-container">
          <div className="final-cta-box">
            <span className="eyebrow">BEGIN YOUR JOURNEY</span>
            <h2>Ready to transform the way you study?</h2>
            <p>Join students and educators using SyllabAI to create smarter, connected study tools today.</p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link href="/student/register" className="hero-button">
                Start Learning Free <span>↗</span>
              </Link>
              <Link href="/teacher/register" className="hero-secondary-btn">
                Educator Registration <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark">s.</span>
          <span>SyllabAI</span>
        </Link>
        <span>Source-grounded educational tools. Built for learners and teachers. <b>✦</b></span>
      </footer>
    </main>
  );
}
