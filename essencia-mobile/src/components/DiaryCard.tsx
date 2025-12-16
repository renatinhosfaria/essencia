import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useScaledFont } from "@/hooks/useScaledFont";
import {
  DiaryEntry,
  MEAL_STATUS_EMOJI,
  MealStatus,
  MOOD_EMOJI,
  MOOD_LABEL,
} from "@/types/diary";
import { Moon, Utensils } from "@tamagui/lucide-icons";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Image, Text, XStack, YStack } from "tamagui";

interface DiaryCardProps {
  entry: DiaryEntry;
  onPress?: () => void;
}

export function DiaryCard({ entry, onPress }: DiaryCardProps) {
  const { settings } = useAccessibility();
  const titleSize = useScaledFont(5);
  const textSize = useScaledFont(3);
  const smallSize = useScaledFont(2);

  const formattedDate = format(parseISO(entry.date), "EEEE, d 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <YStack
      bg="white"
      br="$4"
      p="$4"
      gap="$3"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={2}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      onPress={onPress}
      animation="quick"
    >
      {/* Header com aluno e data */}
      <XStack ai="center" jc="space-between">
        <XStack ai="center" gap="$3">
          {entry.student?.avatarUrl ? (
            <Image
              source={{ uri: entry.student.avatarUrl }}
              width={48}
              height={48}
              borderRadius={24}
            />
          ) : (
            <YStack
              width={48}
              height={48}
              borderRadius={24}
              bg="$primary"
              ai="center"
              jc="center"
            >
              <Text color="white" fontSize={titleSize} fontWeight="bold">
                {entry.student?.name?.[0] || "?"}
              </Text>
            </YStack>
          )}
          <YStack>
            <Text fontSize={titleSize} fontWeight="bold" color="$color">
              {entry.student?.name || "Aluno"}
            </Text>
            <Text fontSize={smallSize} color="$color" opacity={0.6}>
              {formattedDate}
            </Text>
          </YStack>
        </XStack>

        {/* Mood */}
        {entry.mood && (
          <YStack ai="center" bg="$backgroundHover" px="$3" py="$2" br="$3">
            <Text fontSize={24}>{MOOD_EMOJI[entry.mood]}</Text>
            <Text fontSize={smallSize} color="$color" opacity={0.7}>
              {MOOD_LABEL[entry.mood]}
            </Text>
          </YStack>
        )}
      </XStack>

      {/* Refeições */}
      {entry.meals && (
        <YStack gap="$2">
          <XStack ai="center" gap="$2">
            <Utensils size={16} color="$primary" />
            <Text fontSize={textSize} fontWeight="600" color="$color">
              Refeições
            </Text>
          </XStack>
          <XStack gap="$3" flexWrap="wrap">
            {entry.meals.breakfast && (
              <MealBadge label="Café" status={entry.meals.breakfast} />
            )}
            {entry.meals.lunch && (
              <MealBadge label="Almoço" status={entry.meals.lunch} />
            )}
            {entry.meals.snack && (
              <MealBadge label="Lanche" status={entry.meals.snack} />
            )}
          </XStack>
        </YStack>
      )}

      {/* Soneca */}
      {entry.napMinutes !== null && entry.napMinutes > 0 && (
        <XStack ai="center" gap="$2" bg="$backgroundHover" p="$2" br="$2">
          <Moon size={16} color="$secondary" />
          <Text fontSize={textSize} color="$color">
            Soneca:{" "}
            <Text fontWeight="bold">
              {entry.napMinutes >= 60
                ? `${Math.floor(entry.napMinutes / 60)}h ${
                    entry.napMinutes % 60
                  }min`
                : `${entry.napMinutes} minutos`}
            </Text>
          </Text>
        </XStack>
      )}

      {/* Atividades */}
      {entry.activities && entry.activities.length > 0 && (
        <YStack gap="$2">
          <Text fontSize={textSize} fontWeight="600" color="$color">
            Atividades
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {entry.activities.map((activity, index) => (
              <YStack
                key={index}
                bg="$primary"
                px="$2"
                py="$1"
                br="$2"
                opacity={0.9}
              >
                <Text fontSize={smallSize} color="white">
                  {activity}
                </Text>
              </YStack>
            ))}
          </XStack>
        </YStack>
      )}

      {/* Observações */}
      {entry.observations && (
        <YStack
          gap="$1"
          bg="$backgroundHover"
          p="$3"
          br="$2"
          borderLeftWidth={3}
          borderLeftColor="$primary"
        >
          <Text fontSize={textSize} fontWeight="600" color="$color">
            Observações
          </Text>
          <Text fontSize={textSize} color="$color" opacity={0.8}>
            {entry.observations}
          </Text>
        </YStack>
      )}
    </YStack>
  );
}

function MealBadge({ label, status }: { label: string; status: MealStatus }) {
  const bgColor =
    status === "full"
      ? "$success"
      : status === "partial"
      ? "$warning"
      : status === "refused"
      ? "$error"
      : "$neutral";

  return (
    <XStack
      ai="center"
      gap="$1"
      bg={bgColor}
      px="$2"
      py="$1"
      br="$2"
      opacity={0.9}
    >
      <Text fontSize={14}>{MEAL_STATUS_EMOJI[status]}</Text>
      <Text fontSize={12} color="white" fontWeight="500">
        {label}
      </Text>
    </XStack>
  );
}
