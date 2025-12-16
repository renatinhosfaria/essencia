import { useAccessibility } from "@/contexts/AccessibilityContext";

// Token sizes base do Tamagui
export const fontSizes = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 16,
  6: 18,
  7: 21,
  8: 28,
  9: 36,
  10: 48,
} as const;

export type FontSizeKey = keyof typeof fontSizes;

export function useScaledFont(size: FontSizeKey): number {
  const { fontScale } = useAccessibility();
  const baseSize = fontSizes[size];
  return Math.round(baseSize * fontScale);
}
