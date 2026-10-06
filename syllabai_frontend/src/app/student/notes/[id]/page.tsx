import { NoteDetailPage } from "@/components/notes/NoteDetailPage";

export default async function StudentNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoteDetailPage role="student" id={id} />;
}
