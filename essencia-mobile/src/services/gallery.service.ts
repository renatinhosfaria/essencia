import { GalleryPost, GalleryResponse } from "@/types/gallery";
import api from "./api";

export const galleryService = {
  async getPosts(
    page: number = 1,
    limit: number = 20
  ): Promise<GalleryResponse> {
    const { data } = await api.get<{ data: GalleryResponse }>("/gallery", {
      params: { page, limit },
    });
    return data.data;
  },

  async getPostById(id: string): Promise<GalleryPost> {
    const { data } = await api.get<{ data: GalleryPost }>(`/gallery/${id}`);
    return data.data;
  },

  async getPostsByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<GalleryResponse> {
    const { data } = await api.get<{ data: GalleryResponse }>(
      `/gallery/student/${studentId}`,
      {
        params: { page, limit },
      }
    );
    return data.data;
  },

  async getRecentPosts(limit: number = 10): Promise<GalleryPost[]> {
    const { data } = await api.get<{ data: GalleryResponse }>("/gallery", {
      params: { page: 1, limit },
    });
    return data.data.data;
  },
};
