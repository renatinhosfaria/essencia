import { ChatInput } from "@/components/ChatInput";
import { MessageBubbleList } from "@/components/MessageBubbleList";
import { SimplifiedScreenWrapper } from "@/components/SimplifiedScreenWrapper";
import { Skeleton } from "@/components/Skeleton";
import { useMessages, useSendMessage, useWebSocket } from "@/hooks/useMessages";
import { wsService } from "@/services/websocket.service";
import { useScaledFont } from "@/hooks/useScaledFont";
import { ArrowLeft, Wifi, WifiOff } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function ConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const titleSize = useScaledFont(5);

  // WebSocket
  const { isConnected, typingUsers, sendTyping } = useWebSocket();
  const isOtherTyping = typingUsers.has(id);

  useEffect(() => {
    if (!id) return;
    wsService.joinConversation(id);
    return () => wsService.leaveConversation(id);
  }, [id]);

  // Buscar mensagens
  const { data: messages, isLoading } = useMessages(id);

  // Enviar mensagem
  const sendMessage = useSendMessage();

  const handleSend = (content: string) => {
    if (!id) return;
    sendMessage.mutate({ conversationId: id, content });
  };

  const handleTyping = (isTyping: boolean) => {
    if (id) {
      sendTyping(id, isTyping);
    }
  };

  return (
    <SimplifiedScreenWrapper showBack={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <YStack f={1} bg="$background">
          {/* Header */}
          <XStack
            ai="center"
            gap="$3"
            p="$3"
            bg="white"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
          >
            <Button size="$3" circular chromeless onPress={() => router.back()}>
              <ArrowLeft size={24} color="$color" />
            </Button>

            <YStack f={1}>
              <Text fontSize={titleSize} fontWeight="bold" color="$color">
                Conversa
              </Text>
            </YStack>

            {/* Status de conexão */}
            {isConnected ? (
              <Wifi size={18} color="$success" />
            ) : (
              <WifiOff size={18} color="$error" />
            )}
          </XStack>

          {/* Messages */}
          <YStack f={1} bg="$background">
            {isLoading ? (
              <YStack f={1} p="$4" gap="$3">
                {[1, 2, 3, 4].map((i) => (
                  <XStack key={i} jc={i % 2 === 0 ? "flex-end" : "flex-start"}>
                    <Skeleton width={200} height={60} borderRadius={16} />
                  </XStack>
                ))}
              </YStack>
            ) : (
              <MessageBubbleList
                messages={messages || []}
                isTyping={isOtherTyping}
              />
            )}
          </YStack>

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            onTyping={handleTyping}
            disabled={sendMessage.isPending}
          />
        </YStack>
      </KeyboardAvoidingView>
    </SimplifiedScreenWrapper>
  );
}
