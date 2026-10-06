import { AnimationDetailPage } from "@/components/animation/AnimationDetailPage";

export default async function StudentAnimationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnimationDetailPage role="student" id={id} />;
}
