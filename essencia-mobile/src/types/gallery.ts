export interface MediaItem {
  url: string;
  type: "photo" | "video";
  thumbnailUrl?: string;
  key: string;
}

export interface GalleryPost {
  id: string;
  tenantId: string;
  classId: string;
  title: string;
  description?: string | null;
  mediaItems: MediaItem[];
  createdBy: string;
  createdByName?: string;
  taggedStudentIds?: string[];
  taggedStudents?: {
    id: string;
    name: string;
    avatarUrl?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryResponse {
  data: GalleryPost[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}
