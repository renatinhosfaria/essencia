import { ConversationList } from "@/components/ConversationList";
import { SimplifiedScreenWrapper } from "@/components/SimplifiedScreenWrapper";
import { Skeleton } from "@/components/Skeleton";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useConversations, useWebSocket } from "@/hooks/useMessages";
import { useScaledFont } from "@/hooks/useScaledFont";
import { Conversation } from "@/types/messages";
import { MessageCircle, RefreshCw, Wifi, WifiOff } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function ChatScreen() {
  const router = useRouter();
  const { settings } = useAccessibility();
  const titleSize = useScaledFont(6);
  const textSize = useScaledFont(4);

  // WebSocket status
  const { isConnected } = useWebSocket();

  // Buscar conversas
  const { data: conversations, isLoading, refetch } = useConversations();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    router.push({
      pathname: "/chat/[id]",
      params: { id: conversation.id },
    });
  };

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
        contentContainerStyle={{ flexGrow: 1 }}
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
        <YStack f={1}>
          {/* Header */}
          <YStack p="$4" gap="$2">
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$2">
                <MessageCircle size={28} color="$primary" />
                <Text fontSize={titleSize} fontWeight="bold" color="$color">
                  Mensagens
                </Text>
              </XStack>

              {/* Status de conexão */}
              <XStack ai="center" gap="$1">
                {isConnected ? (
                  <>
                    <Wifi size={16} color="$success" />
                    <Text fontSize={12} color="$success">
                      Online
                    </Text>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} color="$error" />
                    <Text fontSize={12} color="$error">
                      Offline
                    </Text>
                  </>
                )}
              </XStack>
            </XStack>

            <Text fontSize={textSize} color="$color" opacity={0.7}>
              Converse com os professores
            </Text>
          </YStack>

          {/* Loading State */}
          {isLoading && (
            <YStack gap="$3" p="$4">
              {[1, 2, 3].map((i) => (
                <XStack key={i} ai="center" gap="$3">
                  <Skeleton width={52} height={52} borderRadius={26} />
                  <YStack f={1} gap="$2">
                    <Skeleton height={18} width="60%" />
                    <Skeleton height={14} width="80%" />
                  </YStack>
                </XStack>
              ))}
            </YStack>
          )}

          {/* Lista de conversas */}
          {!isLoading && conversations && (
            <ConversationList
              conversations={conversations}
              onSelect={handleSelectConversation}
            />
          )}

          {/* Estado vazio */}
          {!isLoading && (!conversations || conversations.length === 0) && (
            <YStack f={1} ai="center" jc="center" p="$4">
              <Text fontSize={64} mb="$2">
                💬
              </Text>
              <Text
                fontSize={textSize}
                fontWeight="600"
                color="$color"
                textAlign="center"
              >
                Nenhuma conversa ainda
              </Text>
              <Text
                fontSize={14}
                color="$color"
                opacity={0.6}
                textAlign="center"
                mt="$2"
              >
                Quando um professor enviar uma mensagem, ela aparecerá aqui
              </Text>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </SimplifiedScreenWrapper>
  );
}
