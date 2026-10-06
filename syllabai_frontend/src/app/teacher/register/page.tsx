import { TeacherRegisterForm } from "@/components/auth/teacher/TeacherRegisterForm";
import { AuthFrame } from "@/components/shared/AuthFrame";

export default function TeacherRegisterPage() {
  return <AuthFrame role="teacher" mode="register"><TeacherRegisterForm /></AuthFrame>;
}
