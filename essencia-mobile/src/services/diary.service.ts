import { DiaryEntry, Student } from "@/types/diary";
import api from "./api";

export const diaryService = {
  /**
   * Buscar entradas do diário do dia para um aluno
   */
  async getTodayEntry(studentId: string): Promise<DiaryEntry | null> {
    const { data } = await api.get<{ data: DiaryEntry | null }>(
      `/diary/student/${studentId}/today`
    );
    return data.data;
  },

  /**
   * Buscar histórico de entradas do diário de um aluno
   */
  async getStudentDiary(
    studentId: string,
    options?: { startDate?: string; endDate?: string; limit?: number }
  ): Promise<DiaryEntry[]> {
    const params = new URLSearchParams();
    if (options?.startDate) params.append("startDate", options.startDate);
    if (options?.endDate) params.append("endDate", options.endDate);
    if (options?.limit) params.append("limit", options.limit.toString());

    const { data } = await api.get<{ data: DiaryEntry[] }>(
      `/diary/student/${studentId}?${params.toString()}`
    );
    return data.data;
  },

  /**
   * Buscar alunos vinculados ao responsável
   */
  async getMyStudents(): Promise<Student[]> {
    const { data } = await api.get<{ data: Student[] }>(
      "/students/my-children"
    );
    return data.data;
  },

  /**
   * Buscar entrada específica por ID
   */
  async getEntry(entryId: string): Promise<DiaryEntry> {
    const { data } = await api.get<{ data: DiaryEntry }>(`/diary/${entryId}`);
    return data.data;
  },

  /**
   * Buscar entradas recentes de todos os filhos
   */
  async getRecentEntries(limit: number = 10): Promise<DiaryEntry[]> {
    const { data } = await api.get<{ data: DiaryEntry[] }>(
      `/diary/recent?limit=${limit}`
    );
    return data.data;
  },
};
