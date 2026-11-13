import { authToken, clearToken } from "./auth";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.error ?? "Request failed");
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
