import { FlashcardStudyPage } from "@/components/flashcards/FlashcardStudyPage";

export default async function StudentFlashcardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FlashcardStudyPage role="student" id={id} />;
}
