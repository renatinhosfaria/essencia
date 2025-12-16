import { DiaryCard } from "@/components/DiaryCard";
import { SimplifiedScreenWrapper } from "@/components/SimplifiedScreenWrapper";
import { Skeleton } from "@/components/Skeleton";
import { StudentSelector } from "@/components/StudentSelector";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  useMyStudents,
  useStudentDiary,
  useTodayDiary,
} from "@/hooks/useDiary";
import { useScaledFont } from "@/hooks/useScaledFont";
import { Student } from "@/types/diary";
import { BookOpen, Calendar, RefreshCw } from "@tamagui/lucide-icons";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function DiaryScreen() {
  const { settings } = useAccessibility();
  const titleSize = useScaledFont(6);
  const textSize = useScaledFont(4);

  // Buscar alunos vinculados
  const {
    data: students,
    isLoading: loadingStudents,
    refetch: refetchStudents,
  } = useMyStudents();

  // Aluno selecionado (default: primeiro filho)
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const activeStudent = selectedStudent || students?.[0];

  // Buscar diário de hoje
  const {
    data: todayEntry,
    isLoading: loadingToday,
    refetch: refetchToday,
  } = useTodayDiary(activeStudent?.id);

  // Buscar histórico (últimos 7 dias)
  const startDate = format(subDays(new Date(), 7), "yyyy-MM-dd");
  const {
    data: history,
    isLoading: loadingHistory,
    refetch: refetchHistory,
  } = useStudentDiary(activeStudent?.id, { startDate, limit: 7 });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStudents(), refetchToday(), refetchHistory()]);
    setRefreshing(false);
  };

  const isLoading = loadingStudents || loadingToday || loadingHistory;
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <SimplifiedScreenWrapper>
      {/* Botão de atualizar para modo simplificado */}
      {settings.simplifiedNav && (
        <Button
          size="$5"
          onPress={onRefresh}
          mx="$4"
          mt="$4"
          icon={<RefreshCw size={20} />}
          bg="$primary"
          color="white"
          height={56}
        >
          Atualizar
        </Button>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          !settings.simplifiedNav ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#F29131"
              colors={["#F29131"]}
            />
          ) : undefined
        }
      >
        <YStack p="$4" gap="$4">
          {/* Header */}
          <YStack gap="$2">
            <XStack ai="center" gap="$2">
              <BookOpen size={28} color="$primary" />
              <Text fontSize={titleSize} fontWeight="bold" color="$color">
                Diário
              </Text>
            </XStack>
            <Text fontSize={textSize} color="$color" opacity={0.7}>
              {today}
            </Text>
          </YStack>

          {/* Seletor de alunos (se tiver mais de 1) */}
          {students && students.length > 1 && (
            <StudentSelector
              students={students}
              selectedId={activeStudent?.id}
              onSelect={setSelectedStudent}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <YStack gap="$4">
              <Skeleton height={200} />
              <Skeleton height={150} />
            </YStack>
          )}

          {/* Diário de hoje */}
          {!isLoading && activeStudent && (
            <YStack gap="$3">
              <XStack ai="center" gap="$2">
                <Calendar size={18} color="$primary" />
                <Text fontSize={textSize} fontWeight="600" color="$color">
                  Hoje
                </Text>
              </XStack>

              {todayEntry ? (
                <DiaryCard entry={{ ...todayEntry, student: activeStudent }} />
              ) : (
                <YStack
                  bg="white"
                  br="$4"
                  p="$6"
                  ai="center"
                  jc="center"
                  gap="$2"
                  shadowColor="$shadowColor"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={4}
                  elevation={1}
                >
                  <Text fontSize={48}>📝</Text>
                  <Text
                    fontSize={textSize}
                    fontWeight="600"
                    color="$color"
                    textAlign="center"
                  >
                    Aguardando entrada do professor
                  </Text>
                  <Text
                    fontSize={14}
                    color="$color"
                    opacity={0.6}
                    textAlign="center"
                  >
                    O diário de {activeStudent.name.split(" ")[0]} será
                    atualizado em breve
                  </Text>
                </YStack>
              )}
            </YStack>
          )}

          {/* Histórico recente */}
          {!isLoading && history && history.length > 0 && (
            <YStack gap="$3" mt="$2">
              <Text fontSize={textSize} fontWeight="600" color="$color">
                Histórico Recente
              </Text>
              {history
                .filter((entry) => entry.id !== todayEntry?.id)
                .slice(0, 5)
                .map((entry) => (
                  <DiaryCard
                    key={entry.id}
                    entry={{ ...entry, student: activeStudent }}
                  />
                ))}
            </YStack>
          )}

          {/* Estado vazio - nenhum aluno */}
          {!isLoading && (!students || students.length === 0) && (
            <YStack
              bg="white"
              br="$4"
              p="$6"
              ai="center"
              jc="center"
              gap="$3"
              mt="$4"
            >
              <Text fontSize={64}>👨‍👩‍👧‍👦</Text>
              <Text
                fontSize={textSize}
                fontWeight="600"
                color="$color"
                textAlign="center"
              >
                Nenhum aluno vinculado
              </Text>
              <Text
                fontSize={14}
                color="$color"
                opacity={0.6}
                textAlign="center"
              >
                Entre em contato com a secretaria para vincular seus filhos à
                sua conta
              </Text>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </SimplifiedScreenWrapper>
  );
}
