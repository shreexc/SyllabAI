import { FlashcardStudyPage } from "@/components/flashcards/FlashcardStudyPage";

export default async function TeacherFlashcardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FlashcardStudyPage role="teacher" id={id} />;
}
