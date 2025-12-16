import { galleryService } from "@/services/gallery.service";
import { GalleryPost, GalleryResponse } from "@/types/gallery";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useGalleryPosts(limit: number = 20) {
  return useInfiniteQuery<GalleryResponse>({
    queryKey: ["gallery", "posts", limit],
    queryFn: ({ pageParam = 1 }) =>
      galleryService.getPosts(pageParam as number, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useGalleryPost(id: string | undefined) {
  return useQuery<GalleryPost>({
    queryKey: ["gallery", "post", id],
    queryFn: () => galleryService.getPostById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentGallery(
  studentId: string | undefined,
  limit: number = 20
) {
  return useInfiniteQuery<GalleryResponse>({
    queryKey: ["gallery", "student", studentId, limit],
    queryFn: ({ pageParam = 1 }) =>
      galleryService.getPostsByStudent(studentId!, pageParam as number, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecentGalleryPosts(limit: number = 10) {
  return useQuery<GalleryPost[]>({
    queryKey: ["gallery", "recent", limit],
    queryFn: () => galleryService.getRecentPosts(limit),
    staleTime: 1000 * 60 * 5,
  });
}
