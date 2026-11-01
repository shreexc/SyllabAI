import { api } from "@/lib/api";

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  class_code?: string;
  teacher_name: string;
  student_count: number;
  created_at: string;
}

export async function listClassrooms(role: "teacher" | "student"): Promise<Classroom[]> {
  const data = await api.get<{ results: Classroom[] }>(`/api/v1/learning/${role}/classrooms/`);
  return data.results;
}

export async function createClassroom(name: string, subject: string): Promise<Classroom> {
  const data = await api.post<{ classroom: Classroom }>("/api/v1/learning/teacher/classrooms/", {
    name,
    subject,
  });
  return data.classroom;
}

export async function joinClassroom(classCode: string): Promise<Classroom> {
  const data = await api.post<{ classroom: Classroom }>("/api/v1/learning/student/classrooms/join/", {
    class_code: classCode,
  });
  return data.classroom;
}
