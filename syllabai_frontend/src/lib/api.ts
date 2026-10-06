import { API_URL } from "@/lib/constants";
import type { ApiEnvelope, ApiError } from "@/types/auth";

let csrfToken: string | null = null;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: ApiError["errors"] = {},
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function getApiErrorDescription(error: unknown): string | undefined {
  if (!(error instanceof ApiRequestError)) return undefined;
  const messages = Object.values(error.errors).flatMap((value) => Array.isArray(value) ? value : [value]);
  return messages.length > 0 ? messages.join(" ") : undefined;
}

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_URL}/api/v1/auth/csrf/`, { credentials: "include", cache: "no-store" });
  const body = (await response.json()) as ApiEnvelope<{ csrf_token: string }>;
  if (!response.ok) throw new ApiRequestError(body.message || "Unable to initialize secure request.", response.status);
  csrfToken = body.data.csrf_token;
  return csrfToken;
}

async function perform<T>(path: string, init: RequestInit, retry: boolean): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  const isMultipart = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (init.body && !isMultipart && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers.set("X-CSRFToken", await getCsrfToken());

  const response = await fetch(`${API_URL}${path}`, { ...init, method, headers, credentials: "include", cache: "no-store" });
  const isCredentialSubmission = path.endsWith("/auth/teacher/login/")
    || path.endsWith("/auth/student/login/")
    || path.endsWith("/auth/teacher/register/")
    || path.endsWith("/auth/student/register/");
  if (response.status === 401 && retry && !isCredentialSubmission && path !== "/api/v1/auth/logout/" && path !== "/api/v1/auth/token/refresh/") {
    const refreshResponse = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRFToken": await getCsrfToken() },
      cache: "no-store",
    });
    if (refreshResponse.ok) return perform<T>(path, init, false);
  }
  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T> & Partial<ApiError>;
  if (!response.ok) {
    throw new ApiRequestError(body.message || "The request could not be completed.", response.status, body.errors ?? {});
  }
  return body.data as T;
}

export const api = {
  get: <T>(path: string) => perform<T>(path, { method: "GET" }, true),
  post: <T>(path: string, data?: unknown) => perform<T>(path, { method: "POST", body: JSON.stringify(data ?? {}) }, false),
  patch: <T>(path: string, data: unknown) => perform<T>(path, { method: "PATCH", body: JSON.stringify(data) }, true),
  postForm: <T>(path: string, data: FormData) => perform<T>(path, { method: "POST", body: data }, false),
};
