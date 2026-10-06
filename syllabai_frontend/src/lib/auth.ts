import { api } from "@/lib/api";
import type { ApiEnvelope, User } from "@/types/auth";

export interface Credentials {
  email: string;
  password: string;
}

export interface Registration extends Credentials {
  first_name: string;
  last_name: string;
}

export async function currentUser(): Promise<User> {
  const data = await api.get<{ user: User }>("/api/v1/auth/me/");
  return data.user;
}

export async function logout(): Promise<void> {
  await api.post<ApiEnvelope<unknown>>("/api/v1/auth/logout/");
}
