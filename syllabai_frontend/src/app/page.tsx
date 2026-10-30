import type { Metadata } from "next";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FooterCta } from "@/components/landing/FooterCta";
import { FormatsSection } from "@/components/landing/FormatsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { Navbar } from "@/components/landing/Navbar";
import { WorkflowSection } from "@/components/landing/WorkflowSection";

export const metadata: Metadata = {
  title: "SyllabAI — Turn your learning material into smarter study tools",
  description:
    "Turn your study materials into source-grounded quizzes, notes, flashcards, diagrams, and animations.",
  openGraph: {
    title: "SyllabAI — Smarter study tools from your material",
    description:
      "Prepare source-grounded study tools from your learning materials.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="landing-page">
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <FormatsSection />
      <AudienceSection />
      <FaqSection />
      <FooterCta />
    </main>
  );
}
