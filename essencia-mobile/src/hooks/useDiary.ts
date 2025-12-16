import { diaryService } from "@/services/diary.service";
import { DiaryEntry, Student } from "@/types/diary";
import { useQuery } from "@tanstack/react-query";

export function useMyStudents() {
  return useQuery<Student[]>({
    queryKey: ["my-students"],
    queryFn: () => diaryService.getMyStudents(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useTodayDiary(studentId: string | undefined) {
  return useQuery<DiaryEntry | null>({
    queryKey: ["diary", "today", studentId],
    queryFn: () => diaryService.getTodayEntry(studentId!),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useStudentDiary(
  studentId: string | undefined,
  options?: { startDate?: string; endDate?: string; limit?: number }
) {
  return useQuery<DiaryEntry[]>({
    queryKey: ["diary", "history", studentId, options],
    queryFn: () => diaryService.getStudentDiary(studentId!, options),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useRecentDiaries(limit: number = 10) {
  return useQuery<DiaryEntry[]>({
    queryKey: ["diary", "recent", limit],
    queryFn: () => diaryService.getRecentEntries(limit),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
