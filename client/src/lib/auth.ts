import { ref } from "vue";
import { apiFetch } from "./api";

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
  const { token } = await apiFetch<{ token: string }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  setToken(token);
}

export function logout(): void {
  clearToken();
}
