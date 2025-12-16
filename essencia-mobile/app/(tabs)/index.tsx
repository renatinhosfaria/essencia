import { InfoCard } from "@/components/InfoCard";
import { SimplifiedScreenWrapper } from "@/components/SimplifiedScreenWrapper";
import { Skeleton } from "@/components/Skeleton";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import { useScaledFont } from "@/hooks/useScaledFont";
import {
  Bell,
  BookOpen,
  MessageCircle,
  RefreshCw,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Button, Text, YStack } from "tamagui";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, isLoading, refetch } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const { settings } = useAccessibility();

  const greetingSize = useScaledFont(8);
  const subtitleSize = useScaledFont(4);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <SimplifiedScreenWrapper showBack={false}>
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
        style={{ backgroundColor: "#FFFFFF" }}
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
        <YStack f={1} p="$4" gap="$4" pt="$8">
          {/* Header */}
          <YStack gap="$2">
            <Text fontSize={greetingSize} fontWeight="bold" color="$color">
              {getGreeting()}, {user?.name?.split(" ")[0] || "Marina"}! 👋
            </Text>
            <Text fontSize={subtitleSize} color="$color" opacity={0.7}>
              Aqui está o resumo de hoje
            </Text>
          </YStack>

          {/* Cards */}
          <YStack gap="$4">
            {/* Diário Card */}
            {isLoading ? (
              <YStack gap="$3" p="$4">
                <Skeleton height={24} width="60%" />
                <Skeleton height={32} width="40%" />
                <Skeleton height={16} width="80%" />
              </YStack>
            ) : (
              <InfoCard
                title="Diário de Hoje"
                value={data?.diaryStatus.hasEntry ? "✓ Completo" : "Pendente"}
                subtitle={
                  data?.diaryStatus.hasEntry
                    ? `${data.diaryStatus.entryCount} entrada(s) hoje`
                    : "Aguardando entrada do professor"
                }
                icon={<BookOpen size={24} color="#CEDE6C" />}
                onPress={() => router.push("/diary")}
                isEmpty={!data?.diaryStatus.hasEntry}
                emptyMessage="Ainda não há entradas no diário hoje"
              />
            )}

            {/* Mensagens Card */}
            {isLoading ? (
              <YStack gap="$3" p="$4">
                <Skeleton height={24} width="60%" />
                <Skeleton height={32} width="40%" />
                <Skeleton height={16} width="80%" />
              </YStack>
            ) : (
              <InfoCard
                title="Mensagens"
                value={data?.unreadMessages.count || 0}
                subtitle={
                  data?.unreadMessages.count
                    ? `Última: ${data.unreadMessages.latestSender}`
                    : "Sem mensagens novas"
                }
                icon={<MessageCircle size={24} color="#F29131" />}
                onPress={() => router.push("/chat")}
                isEmpty={!data?.unreadMessages.count}
              />
            )}

            {/* Comunicados Card */}
            {isLoading ? (
              <YStack gap="$3" p="$4">
                <Skeleton height={24} width="60%" />
                <Skeleton height={32} width="40%" />
                <Skeleton height={16} width="80%" />
              </YStack>
            ) : (
              <InfoCard
                title="Comunicados Recentes"
                value={data?.announcements.length || 0}
                subtitle={
                  data?.announcements[0]
                    ? data.announcements[0].title
                    : "Nenhum comunicado novo"
                }
                icon={<Bell size={24} color="#F29131" />}
                onPress={() => router.push("/diary")}
                isEmpty={!data?.announcements.length}
              />
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </SimplifiedScreenWrapper>
  );
}
