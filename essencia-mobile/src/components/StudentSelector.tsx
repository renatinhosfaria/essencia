import { useScaledFont } from "@/hooks/useScaledFont";
import { Student } from "@/types/diary";
import { ChevronRight } from "@tamagui/lucide-icons";
import { Image, Text, XStack, YStack } from "tamagui";

interface StudentSelectorProps {
  students: Student[];
  selectedId: string | undefined;
  onSelect: (student: Student) => void;
}

export function StudentSelector({
  students,
  selectedId,
  onSelect,
}: StudentSelectorProps) {
  const titleSize = useScaledFont(4);
  const textSize = useScaledFont(3);

  if (students.length === 0) {
    return (
      <YStack p="$4" ai="center" jc="center" bg="$backgroundHover" br="$3">
        <Text fontSize={textSize} color="$color" opacity={0.6}>
          Nenhum aluno vinculado
        </Text>
      </YStack>
    );
  }

  if (students.length === 1) {
    // Se só tem um filho, não precisa de seletor
    return null;
  }

  return (
    <YStack gap="$2">
      <Text fontSize={textSize} fontWeight="600" color="$color" opacity={0.7}>
        Selecione o aluno:
      </Text>
      <XStack gap="$3" flexWrap="wrap">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            isSelected={student.id === selectedId}
            onPress={() => onSelect(student)}
          />
        ))}
      </XStack>
    </YStack>
  );
}

interface StudentCardProps {
  student: Student;
  isSelected: boolean;
  onPress: () => void;
}

function StudentCard({ student, isSelected, onPress }: StudentCardProps) {
  const textSize = useScaledFont(3);

  return (
    <XStack
      ai="center"
      gap="$2"
      bg={isSelected ? "$primary" : "white"}
      px="$3"
      py="$2"
      br="$3"
      borderWidth={2}
      borderColor={isSelected ? "$primary" : "$borderColor"}
      pressStyle={{ scale: 0.97 }}
      onPress={onPress}
      animation="quick"
      minWidth={120}
    >
      {student.avatarUrl ? (
        <Image
          source={{ uri: student.avatarUrl }}
          width={36}
          height={36}
          borderRadius={18}
        />
      ) : (
        <YStack
          width={36}
          height={36}
          borderRadius={18}
          bg={isSelected ? "white" : "$primary"}
          ai="center"
          jc="center"
        >
          <Text
            color={isSelected ? "$primary" : "white"}
            fontSize={16}
            fontWeight="bold"
          >
            {student.name[0]}
          </Text>
        </YStack>
      )}
      <YStack f={1}>
        <Text
          fontSize={textSize}
          fontWeight="600"
          color={isSelected ? "white" : "$color"}
          numberOfLines={1}
        >
          {student.name.split(" ")[0]}
        </Text>
      </YStack>
      {isSelected && <ChevronRight size={16} color="white" />}
    </XStack>
  );
}
