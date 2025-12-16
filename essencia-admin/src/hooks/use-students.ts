"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Student {
  id: string;
  tenantId: string;
  classId?: string;
  name: string;
  dateOfBirth: string;
  gender?: string;
  enrolledAt: string;
  status: "active" | "inactive" | "graduated" | "transferred";
  allergies?: string[];
  medicalNotes?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  className?: string;
  guardians?: Guardian[];
}

export interface Guardian {
  id: string;
  userId: string;
  studentId: string;
  relation: string;
  isPrimary: boolean;
  canPickup: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateStudentInput {
  name: string;
  dateOfBirth: string;
  classId?: string;
  gender?: string;
  allergies?: string[];
  medicalNotes?: string;
}

export interface UpdateStudentInput extends Partial<CreateStudentInput> {
  status?: "active" | "inactive" | "graduated" | "transferred";
}

export function useStudents(params?: { classId?: string; status?: string }) {
  return useQuery<Student[]>({
    queryKey: ["students", params],
    queryFn: async () => {
      const { data } = await api.get("/students", { params });
      return data.data;
    },
  });
}

export function useStudent(id: string) {
  return useQuery<Student>({
    queryKey: ["student", id],
    queryFn: async () => {
      const { data } = await api.get(`/students/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStudentInput) => {
      const { data } = await api.post("/students", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateStudentInput & { id: string }) => {
      const { data } = await api.put(`/students/${id}`, input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useStudentGuardians(studentId: string) {
  return useQuery<Guardian[]>({
    queryKey: ["student-guardians", studentId],
    queryFn: async () => {
      const { data } = await api.get(`/students/${studentId}/guardians`);
      return data.data;
    },
    enabled: !!studentId,
  });
}

/**
 * FR11-13: Link guardian to student
 */
export function useLinkGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      guardianId,
      relationship,
      isPrimary,
      canPickup,
    }: {
      studentId: string;
      guardianId: string;
      relationship: string;
      isPrimary?: boolean;
      canPickup?: boolean;
    }) => {
      const { data } = await api.post(`/students/${studentId}/guardians`, {
        guardianId,
        relationship,
        isPrimary,
        canPickup,
      });
      return data;
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["student-guardians", studentId],
      });
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
    },
  });
}

/**
 * FR11-13: Update guardian link
 */
export function useUpdateGuardianLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      guardianId,
      relationship,
      isPrimary,
      canPickup,
    }: {
      studentId: string;
      guardianId: string;
      relationship?: string;
      isPrimary?: boolean;
      canPickup?: boolean;
    }) => {
      const { data } = await api.patch(
        `/students/${studentId}/guardians/${guardianId}`,
        { relationship, isPrimary, canPickup }
      );
      return data;
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["student-guardians", studentId],
      });
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
    },
  });
}

/**
 * FR11-13: Remove guardian from student
 */
export function useUnlinkGuardian() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      guardianId,
    }: {
      studentId: string;
      guardianId: string;
    }) => {
      await api.delete(`/students/${studentId}/guardians/${guardianId}`);
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["student-guardians", studentId],
      });
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
    },
  });
}
