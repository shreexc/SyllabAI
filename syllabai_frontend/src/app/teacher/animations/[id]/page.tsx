import { AnimationDetailPage } from "@/components/animation/AnimationDetailPage";

export default async function TeacherAnimationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnimationDetailPage role="teacher" id={id} />;
}
