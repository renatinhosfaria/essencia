"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface MediaItem {
  url: string;
  type: "photo" | "video";
  thumbnailUrl?: string;
  key: string;
}

export interface GalleryPost {
  id: string;
  classId: string;
  title: string;
  description?: string;
  mediaItems: MediaItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  className?: string;
  authorName?: string;
  studentTags?: string[];
}

export interface CreateGalleryPostInput {
  classId: string;
  title: string;
  description?: string;
  studentIds?: string[];
}

export function useGalleryPosts(classId?: string) {
  return useQuery<GalleryPost[]>({
    queryKey: ["gallery", classId],
    queryFn: async () => {
      const params = classId ? { classId } : {};
      const { data } = await api.get("/gallery", { params });
      return data.data?.data ?? [];
    },
  });
}

export function useGalleryPost(id: string) {
  return useQuery<GalleryPost>({
    queryKey: ["gallery", id],
    queryFn: async () => {
      const { data } = await api.get(`/gallery/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateGalleryPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGalleryPostInput) => {
      const { data } = await api.post("/gallery", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useUploadMedia() {
  return useMutation({
    mutationFn: async ({
      postId,
      files,
    }: {
      postId: string;
      files: File[];
    }) => {
      const formData = new FormData();
      // Use 'files' (plural) to match backend expectation
      files.forEach((file) => formData.append("files", file));
      const { data } = await api.post(`/gallery/${postId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
  });
}

export function useDeleteGalleryPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}
