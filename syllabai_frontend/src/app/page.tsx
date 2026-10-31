import type { Metadata } from "next";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FooterCta } from "@/components/landing/FooterCta";
import { FormatsSection } from "@/components/landing/FormatsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { Navbar } from "@/components/landing/Navbar";

export const metadata: Metadata = {
  title: "SyllabAI — Make room for a brighter way to learn",
  description:
    "Thoughtful tools for teachers and students to make learning feel more human, curious, and their own.",
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
