import { StudentRegisterForm } from "@/components/auth/student/StudentRegisterForm";
import { AuthFrame } from "@/components/shared/AuthFrame";

export default function StudentRegisterPage() {
  return <AuthFrame role="student" mode="register"><StudentRegisterForm /></AuthFrame>;
}
