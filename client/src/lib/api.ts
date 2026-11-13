import { authToken, clearToken } from "./auth";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function extractErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const { error, details } = body as { error?: string; details?: Record<string, string[]> };
  const firstDetail = details && Object.values(details).flat()[0];
  return firstDetail ?? error ?? null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, extractErrorMessage(body) ?? "Request failed");
  }
  return response.json();
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, init);
  return handleResponse<T>(response);
}

export async function authFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (authToken.value) {
    headers.set("Authorization", `Bearer ${authToken.value}`);
  }
  const response = await fetch(path, { ...init, headers });
  if (response.status === 401) {
    clearToken();
  }
  return handleResponse<T>(response);
}
