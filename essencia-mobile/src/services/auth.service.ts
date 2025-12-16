import { env } from "@/config/env";
import { LoginRequest, LoginResponse, User } from "@/types/auth";
import api from "./api";
import * as SecureStore from "expo-secure-store";

type ApiResponse<T> = {
  data: T;
};

export const authService = {
  async login(
    credentials: Omit<LoginRequest, "tenantSlug">
  ): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      ...credentials,
      tenantSlug: env.tenantSlug,
    });
    return data.data;
  },

  async logout(): Promise<void> {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) return;
    await api.post("/auth/logout", { refreshToken });
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<ApiResponse<{
      sub: string;
      email: string;
      role: string;
      tenantId: string;
    }>>("/auth/me");

    return {
      id: data.data.sub,
      email: data.data.email,
      name: data.data.email,
      role: data.data.role,
      tenantId: data.data.tenantId,
    };
  },

  async refreshToken(
    refreshToken: string
  ): Promise<Pick<LoginResponse, "accessToken" | "refreshToken">> {
    const { data } = await api.post<
      ApiResponse<Pick<LoginResponse, "accessToken" | "refreshToken">>
    >("/auth/refresh", {
      refreshToken,
    });
    return data.data;
  },
};
