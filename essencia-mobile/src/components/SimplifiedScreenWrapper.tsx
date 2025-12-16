import { useAccessibility } from "@/contexts/AccessibilityContext";
import { ReactNode } from "react";
import { YStack } from "tamagui";
import { SimplifiedHeader } from "./SimplifiedHeader";

interface SimplifiedScreenWrapperProps {
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export function SimplifiedScreenWrapper({
  children,
  showBack = true,
  onBack,
}: SimplifiedScreenWrapperProps) {
  const { settings } = useAccessibility();

  return (
    <YStack f={1} bg="$background">
      {settings.simplifiedNav && (
        <SimplifiedHeader showBack={showBack} onBack={onBack} />
      )}
      {children}
    </YStack>
  );
}
