import { ImageDetailPage } from "@/components/images/ImageDetailPage";

export default async function TeacherImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ImageDetailPage role="teacher" id={id} />;
}
