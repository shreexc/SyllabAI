import { StudentLoginForm } from "@/components/auth/student/StudentLoginForm";
import { AuthFrame } from "@/components/shared/AuthFrame";

export default function StudentLoginPage() {
  return <AuthFrame role="student" mode="login"><StudentLoginForm /></AuthFrame>;
}
