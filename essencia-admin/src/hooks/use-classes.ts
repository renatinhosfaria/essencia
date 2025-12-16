"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Class {
  id: string;
  name: string;
  grade: string;
  year: number;
  shift: "morning" | "afternoon" | "full";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  teacherCount?: number;
  studentCount?: number;
}

export interface CreateClassInput {
  name: string;
  grade: string;
  year: number;
  shift: "morning" | "afternoon" | "full";
}

export interface UpdateClassInput extends Partial<CreateClassInput> {
  status?: "active" | "inactive";
}

export function useClasses(params?: { year?: number; status?: string }) {
  return useQuery<Class[]>({
    queryKey: ["classes", params],
    queryFn: async () => {
      const { data } = await api.get("/classes", { params });
      return data.data;
    },
  });
}

export function useClass(id: string) {
  return useQuery<Class>({
    queryKey: ["class", id],
    queryFn: async () => {
      const { data } = await api.get(`/classes/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateClassInput) => {
      const { data } = await api.post("/classes", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateClassInput & { id: string }) => {
      const { data } = await api.put(`/classes/${id}`, input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useClassStudents(classId: string) {
  return useQuery({
    queryKey: ["class-students", classId],
    queryFn: async () => {
      const { data } = await api.get(`/classes/${classId}/students`);
      return data.data;
    },
    enabled: !!classId,
  });
}

export function useClassTeachers(classId: string) {
  return useQuery({
    queryKey: ["class-teachers", classId],
    queryFn: async () => {
      const { data } = await api.get(`/classes/${classId}/teachers`);
      return data.data;
    },
    enabled: !!classId,
  });
}

export function useAssignTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      teacherId,
      isPrimary,
    }: {
      classId: string;
      teacherId: string;
      isPrimary?: boolean;
    }) => {
      const { data } = await api.post(`/classes/${classId}/teachers`, {
        teacherId,
        isPrimary,
      });
      return data.data;
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ["class-teachers", classId] });
    },
  });
}

/**
 * FR35-38: Update teacher assignment
 */
export function useUpdateTeacherAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      teacherId,
      isPrimary,
    }: {
      classId: string;
      teacherId: string;
      isPrimary: boolean;
    }) => {
      const { data } = await api.patch(
        `/classes/${classId}/teachers/${teacherId}`,
        { isPrimary }
      );
      return data;
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ["class-teachers", classId] });
    },
  });
}

/**
 * FR35-38: Remove teacher from class
 */
export function useUnassignTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      teacherId,
    }: {
      classId: string;
      teacherId: string;
    }) => {
      await api.delete(`/classes/${classId}/teachers/${teacherId}`);
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ["class-teachers", classId] });
    },
  });
}
