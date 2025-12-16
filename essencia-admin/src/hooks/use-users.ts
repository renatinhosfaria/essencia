"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "guardian";
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: "admin" | "teacher" | "guardian";
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  role?: "admin" | "teacher" | "guardian";
  isActive?: boolean;
}

export function useUsers(params?: { role?: string; isActive?: boolean }) {
  return useQuery<User[]>({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await api.get("/users", { params });
      return data.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const { data } = await api.post("/users", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateUserInput & { id: string }) => {
      const { data } = await api.put(`/users/${id}`, input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/users/${id}/reset-password`);
      return data.data;
    },
  });
}
