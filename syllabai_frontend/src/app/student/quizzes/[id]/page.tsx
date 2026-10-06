import { QuizDetailPage } from "@/components/quiz/QuizDetailPage";

export default async function StudentQuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuizDetailPage role="student" id={id} />;
}
