import { QuizAttemptPage } from "@/components/quiz/QuizAttemptPage";

export default async function StudentQuizAttemptRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuizAttemptPage id={id} />;
}
