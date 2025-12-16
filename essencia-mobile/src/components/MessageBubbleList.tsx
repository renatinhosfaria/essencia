import { useAuth } from "@/contexts/AuthContext";
import { useScaledFont } from "@/hooks/useScaledFont";
import { Message } from "@/types/messages";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useRef } from "react";
import { FlatList } from "react-native";
import { Text, XStack, YStack } from "tamagui";

interface MessageBubbleListProps {
  messages: Message[];
  isTyping?: boolean;
  typingUserName?: string;
}

export function MessageBubbleList({
  messages,
  isTyping,
  typingUserName,
}: MessageBubbleListProps) {
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  // Agrupar mensagens por data
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <FlatList
      ref={flatListRef}
      data={groupedMessages}
      keyExtractor={(item) =>
        item.type === "date" ? `date-${item.date}` : item.message.id
      }
      renderItem={({ item }) => {
        if (item.type === "date") {
          return <DateSeparator date={item.date} />;
        }

        const isOwn = item.message.senderId === user?.id;
        return (
          <MessageBubble
            message={item.message}
            isOwn={isOwn}
            showAvatar={!isOwn}
          />
        );
      }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: isTyping ? 40 : 16,
      }}
      inverted={false}
      onContentSizeChange={() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }}
      ListFooterComponent={
        isTyping ? <TypingIndicator name={typingUserName} /> : null
      }
    />
  );
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const textSize = useScaledFont(3);
  const smallSize = useScaledFont(2);

  const time = format(parseISO(message.createdAt), "HH:mm");

  return (
    <XStack jc={isOwn ? "flex-end" : "flex-start"} mb="$2" px="$1">
      <YStack
        maxWidth="80%"
        bg={isOwn ? "$primary" : "white"}
        px="$3"
        py="$2"
        br="$4"
        borderBottomRightRadius={isOwn ? 4 : 16}
        borderBottomLeftRadius={isOwn ? 16 : 4}
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={1}
      >
        {/* Sender name (for received messages) */}
        {!isOwn && message.sender && (
          <Text fontSize={smallSize} fontWeight="600" color="$primary" mb="$1">
            {message.sender.name}
          </Text>
        )}

        {/* Message content */}
        <Text
          fontSize={textSize}
          color={isOwn ? "white" : "$color"}
          lineHeight={textSize * 1.4}
        >
          {message.content}
        </Text>

        {/* Time and status */}
        <XStack ai="center" jc="flex-end" gap="$1" mt="$1">
          <Text fontSize={10} color={isOwn ? "white" : "$color"} opacity={0.6}>
            {time}
          </Text>
          {isOwn && (
            <Text
              fontSize={10}
              color={
                message.status === "read"
                  ? "#22C55E"
                  : isOwn
                  ? "white"
                  : "$color"
              }
              opacity={message.status === "read" ? 1 : 0.6}
            >
              {message.status === "read"
                ? "✓✓"
                : message.status === "delivered"
                ? "✓✓"
                : "✓"}
            </Text>
          )}
        </XStack>
      </YStack>
    </XStack>
  );
}

function DateSeparator({ date }: { date: string }) {
  const smallSize = useScaledFont(2);

  const dateObj = parseISO(date);
  const isToday = isSameDay(dateObj, new Date());
  const isYesterday = isSameDay(
    dateObj,
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  let label = format(dateObj, "d 'de' MMMM", { locale: ptBR });
  if (isToday) label = "Hoje";
  if (isYesterday) label = "Ontem";

  return (
    <XStack jc="center" py="$3">
      <YStack bg="$backgroundHover" px="$3" py="$1" br="$4">
        <Text fontSize={smallSize} color="$color" opacity={0.6}>
          {label}
        </Text>
      </YStack>
    </XStack>
  );
}

function TypingIndicator({ name }: { name?: string }) {
  const smallSize = useScaledFont(2);

  return (
    <XStack px="$3" py="$2">
      <YStack bg="$backgroundHover" px="$3" py="$2" br="$3">
        <Text fontSize={smallSize} color="$color" opacity={0.6}>
          {name || "Alguém"} está digitando...
        </Text>
      </YStack>
    </XStack>
  );
}

// Helper: agrupa mensagens por data
type GroupedItem =
  | { type: "date"; date: string }
  | { type: "message"; message: Message };

function groupMessagesByDate(messages: Message[]): GroupedItem[] {
  const result: GroupedItem[] = [];
  let currentDate: string | null = null;

  for (const message of messages) {
    const messageDate = format(parseISO(message.createdAt), "yyyy-MM-dd");

    if (messageDate !== currentDate) {
      result.push({ type: "date", date: messageDate });
      currentDate = messageDate;
    }

    result.push({ type: "message", message });
  }

  return result;
}
