import { ImageDetailPage } from "@/components/images/ImageDetailPage";

export default async function StudentImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ImageDetailPage role="student" id={id} />;
}
