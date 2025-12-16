// API Configuration for Landing Page

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "essencia-feliz";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      tenantSlug: TENANT_SLUG,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erro ao fazer login. Tente novamente.",
    }));
    throw new Error(error.message || "Credenciais inválidas");
  }

  const json = await response.json();
  return json.data ?? json;
}

// Store tokens in localStorage
export function saveTokens(accessToken: string, refreshToken: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}
