import { TeacherLoginForm } from "@/components/auth/teacher/TeacherLoginForm";
import { AuthFrame } from "@/components/shared/AuthFrame";

export default function TeacherLoginPage() {
  return <AuthFrame role="teacher" mode="login"><TeacherLoginForm /></AuthFrame>;
}
