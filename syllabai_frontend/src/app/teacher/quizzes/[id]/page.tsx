import { QuizDetailPage } from "@/components/quiz/QuizDetailPage";

export default async function TeacherQuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuizDetailPage role="teacher" id={id} />;
}
