import { NoteDetailPage } from "@/components/notes/NoteDetailPage";

export default async function TeacherNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoteDetailPage role="teacher" id={id} />;
}
