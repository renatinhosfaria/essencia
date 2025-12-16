"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Announcement {
  id: string;
  authorId: string;
  title: string;
  content: string;
  priority: "normal" | "high" | "urgent";
  targetAudience: "all" | "specific_classes" | "specific_students";
  targetClassIds: string[];
  targetStudentIds: string[];
  publishedAt?: string;
  expiresAt?: string;
  sendPushNotification: boolean;
  pushNotificationSentAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
  };
  readCount?: number;
  totalRecipients?: number;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority?: "normal" | "high" | "urgent";
  targetAudience: "all" | "specific_classes" | "specific_students";
  targetClassIds?: string[];
  targetStudentIds?: string[];
  expiresAt?: string;
  sendPushNotification?: boolean;
  publishNow?: boolean;
}

export function useAnnouncements(params?: { published?: boolean }) {
  return useQuery<Announcement[]>({
    queryKey: ["announcements", params],
    queryFn: async () => {
      const { data } = await api.get("/announcements", { params });
      return data.data;
    },
  });
}

export function useAnnouncement(id: string) {
  return useQuery<Announcement>({
    queryKey: ["announcement", id],
    queryFn: async () => {
      const { data } = await api.get(`/announcements/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAnnouncementInput) => {
      const { data } = await api.post("/announcements", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function usePublishAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/announcements/${id}/publish`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useAnnouncementStats(id: string) {
  return useQuery<{
    readCount: number;
    totalRecipients: number;
    reads: { userId: string; userName: string; readAt: string }[];
  }>({
    queryKey: ["announcement-stats", id],
    queryFn: async () => {
      const { data } = await api.get(`/announcements/${id}/stats`);
      return data.data;
    },
    enabled: !!id,
  });
}
