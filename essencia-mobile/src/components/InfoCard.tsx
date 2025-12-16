import { useScaledFont } from "@/hooks/useScaledFont";
import { ChevronRight } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { Card, Spinner, Text, XStack, YStack } from "tamagui";

interface InfoCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function InfoCard({
  title,
  value,
  subtitle,
  icon,
  onPress,
  loading,
  isEmpty,
  emptyMessage,
}: InfoCardProps) {
  const titleSize = useScaledFont(5);
  const valueSize = useScaledFont(7);
  const subtitleSize = useScaledFont(3);

  const content = (
    <Card
      bordered
      p="$4"
      bg="$backgroundHover"
      pressStyle={{ scale: 0.98, opacity: 0.8 }}
      animation="quick"
      minHeight={56}
    >
      <YStack gap="$3">
        <XStack jc="space-between" ai="center">
          <XStack gap="$3" ai="center" f={1}>
            {icon}
            <Text fontSize={titleSize} fontWeight="600" color="$color">
              {title}
            </Text>
          </XStack>
          {onPress && (
            <XStack w={48} h={48} ai="center" jc="center">
              <ChevronRight size={24} color="$color" opacity={0.5} />
            </XStack>
          )}
        </XStack>

        {loading ? (
          <YStack ai="center" py="$4">
            <Spinner color="$primary" />
          </YStack>
        ) : isEmpty ? (
          <Text color="$color" opacity={0.6} fontSize={subtitleSize}>
            {emptyMessage || "Nenhum dado disponível"}
          </Text>
        ) : (
          <YStack gap="$2">
            {value !== undefined && (
              <Text fontSize={valueSize} fontWeight="bold" color="$primary">
                {value}
              </Text>
            )}
            {subtitle && (
              <Text fontSize={subtitleSize} color="$color" opacity={0.7}>
                {subtitle}
              </Text>
            )}
          </YStack>
        )}
      </YStack>
    </Card>
  );

  if (onPress && !loading) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title}${
          value !== undefined ? `, ${value}` : ""
        }${subtitle ? `, ${subtitle}` : ""}`}
        accessibilityHint="Toque duas vezes para abrir"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
