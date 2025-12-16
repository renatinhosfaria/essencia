import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useScaledFont } from "@/hooks/useScaledFont";
import { ChevronLeft, Home } from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "expo-router";
import { Button, Text, XStack, YStack } from "tamagui";

interface SimplifiedHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export function SimplifiedHeader({ showBack, onBack }: SimplifiedHeaderProps) {
  const { settings } = useAccessibility();
  const router = useRouter();
  const pathname = usePathname();
  const breadcrumbSize = useScaledFont(3);

  if (!settings.simplifiedNav) return null;

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const breadcrumbs = ["Início"];

    parts.forEach((part) => {
      if (part === "(tabs)") return;
      if (part === "accessibility") breadcrumbs.push("Acessibilidade");
      if (part === "profile") breadcrumbs.push("Perfil");
      if (part === "diary") breadcrumbs.push("Diário");
      if (part === "chat") breadcrumbs.push("Chat");
    });

    return breadcrumbs.join(" > ");
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <YStack
      bg="$background"
      borderBottomWidth={2}
      borderBottomColor="$borderColor"
      pb="$3"
    >
      <XStack jc="space-between" ai="center" px="$4" pt="$3">
        {showBack && router.canGoBack() ? (
          <Button
            size="$4"
            icon={<ChevronLeft size={24} />}
            onPress={handleBack}
            bg="$primary"
            color="white"
            pressStyle={{ opacity: 0.8 }}
            minWidth={120}
            height={48}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            accessibilityHint="Retorna para a tela anterior"
          >
            Voltar
          </Button>
        ) : (
          <YStack width={120} />
        )}

        <Button
          size="$4"
          icon={<Home size={24} />}
          onPress={handleHome}
          bg="$secondary"
          color="$color"
          pressStyle={{ opacity: 0.8 }}
          minWidth={120}
          height={48}
          accessibilityRole="button"
          accessibilityLabel="Início"
          accessibilityHint="Retorna para a tela inicial"
        >
          Início
        </Button>
      </XStack>

      <Text
        fontSize={breadcrumbSize}
        color="$placeholder"
        ta="center"
        mt="$2"
        px="$4"
      >
        {getBreadcrumbs()}
      </Text>
    </YStack>
  );
}
