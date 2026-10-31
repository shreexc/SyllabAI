import type { Metadata } from "next";
import { SyllabAIHomePage } from "@/components/home/SyllabAIHomePage";

export const metadata: Metadata = {
  title: "SyllabAI — Your Study Space & Learning Overview",
  description:
    "Study at your own pace with quizzes, flashcards, short notes, and animations.",
};

export default function Home() {
  return <SyllabAIHomePage />;
}
