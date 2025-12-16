export type MealStatus = "full" | "partial" | "refused" | "na";
export type Mood = "happy" | "calm" | "tired" | "upset";

export interface DiaryEntry {
  id: string;
  tenantId: string;
  studentId: string;
  classId: string;
  date: string;
  mood: Mood | null;
  meals: {
    breakfast?: MealStatus;
    lunch?: MealStatus;
    snack?: MealStatus;
  } | null;
  napMinutes: number | null;
  activities: string[] | null;
  observations: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface Student {
  id: string;
  tenantId: string;
  classId: string | null;
  name: string;
  birthDate: string | null;
  avatarUrl: string | null;
  status: string;
}

export const MOOD_EMOJI: Record<Mood, string> = {
  happy: "😊",
  calm: "😌",
  tired: "😴",
  upset: "😢",
};

export const MOOD_LABEL: Record<Mood, string> = {
  happy: "Feliz",
  calm: "Calmo",
  tired: "Cansado",
  upset: "Chateado",
};

export const MEAL_STATUS_EMOJI: Record<MealStatus, string> = {
  full: "🍽️",
  partial: "🍴",
  refused: "❌",
  na: "➖",
};

export const MEAL_STATUS_LABEL: Record<MealStatus, string> = {
  full: "Comeu tudo",
  partial: "Comeu parcial",
  refused: "Recusou",
  na: "Não aplicável",
};
