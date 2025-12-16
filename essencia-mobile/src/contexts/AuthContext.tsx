import { authService } from "@/services/auth.service";
import { pushService } from "@/services/push.service";
import { AuthState, LoginRequest } from "@/types/auth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData extends AuthState {
  login: (credentials: Omit<LoginRequest, "tenantSlug">) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Carrega dados salvos ao iniciar app
  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const [accessToken, refreshToken, userJson] = await Promise.all([
        SecureStore.getItemAsync("accessToken"),
        SecureStore.getItemAsync("refreshToken"),
        SecureStore.getItemAsync("user"),
      ]);

      if (accessToken && userJson) {
        const user = JSON.parse(userJson);
        setState({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });

        void pushService.tryRegisterDeviceToken().catch(() => undefined);
        router.replace("/(tabs)");
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }

  async function login(credentials: Omit<LoginRequest, "tenantSlug">) {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await authService.login(credentials);

      // Salva tokens e usuário
      await Promise.all([
        SecureStore.setItemAsync("accessToken", response.accessToken),
        SecureStore.setItemAsync("refreshToken", response.refreshToken),
        SecureStore.setItemAsync("user", JSON.stringify(response.user)),
      ]);

      setState({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      void pushService.tryRegisterDeviceToken().catch(() => undefined);

      router.replace("/(tabs)");
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }

  async function logout() {
    try {
      // Remove device token antes de chamar logout
      await pushService.tryRemoveDeviceToken().catch(() => undefined);
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Limpa storage mesmo se API falhar
      await Promise.all([
        SecureStore.deleteItemAsync("accessToken"),
        SecureStore.deleteItemAsync("refreshToken"),
        SecureStore.deleteItemAsync("user"),
      ]);

      setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      router.replace("/(auth)/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        loadStoredAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
