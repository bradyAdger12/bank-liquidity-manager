import { ref } from "vue";

const TOKEN_KEY = "auth_token";

export const authToken = ref<string | null>(localStorage.getItem(TOKEN_KEY));
const token = authToken;

export function isAuthenticated(): boolean {
  return token.value !== null;
}

export function setToken(value: string): void {
  token.value = value;
  localStorage.setItem(TOKEN_KEY, value);
}

export function clearToken(): void {
  token.value = null;
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "Login failed");
  }

  const { token: newToken } = await response.json();
  setToken(newToken);
}

export function logout(): void {
  clearToken();
}
