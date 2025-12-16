import { useScaledFont } from "@/hooks/useScaledFont";
import { Conversation } from "@/types/messages";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Image, Text, XStack, YStack } from "tamagui";

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4">
        <Text fontSize={48} mb="$2">
          💬
        </Text>
        <Text fontSize={16} color="$color" opacity={0.6} textAlign="center">
          Nenhuma conversa ainda
        </Text>
        <Text
          fontSize={14}
          color="$color"
          opacity={0.4}
          textAlign="center"
          mt="$1"
        >
          Suas conversas com professores aparecerão aqui
        </Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$1">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onPress={() => onSelect(conversation)}
        />
      ))}
    </YStack>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  const titleSize = useScaledFont(4);
  const textSize = useScaledFont(3);
  const smallSize = useScaledFont(2);

  const participant = conversation.otherParticipant;
  const lastMessage = conversation.lastMessage;
  const unreadCount = conversation.unreadCount || 0;

  const timeAgo = conversation.lastMessageAt
    ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
        addSuffix: true,
        locale: ptBR,
      })
    : "";

  return (
    <XStack
      ai="center"
      gap="$3"
      p="$3"
      bg={unreadCount > 0 ? "$backgroundHover" : "transparent"}
      pressStyle={{ bg: "$backgroundPress" }}
      onPress={onPress}
      animation="quick"
    >
      {/* Avatar */}
      {participant?.avatarUrl ? (
        <Image
          source={{ uri: participant.avatarUrl }}
          width={52}
          height={52}
          borderRadius={26}
        />
      ) : (
        <YStack
          width={52}
          height={52}
          borderRadius={26}
          bg="$primary"
          ai="center"
          jc="center"
        >
          <Text color="white" fontSize={20} fontWeight="bold">
            {participant?.name?.[0] || "?"}
          </Text>
        </YStack>
      )}

      {/* Content */}
      <YStack f={1} gap="$1">
        <XStack ai="center" jc="space-between">
          <Text
            fontSize={titleSize}
            fontWeight={unreadCount > 0 ? "bold" : "600"}
            color="$color"
            numberOfLines={1}
            f={1}
          >
            {participant?.name || "Usuário"}
          </Text>
          <Text fontSize={smallSize} color="$color" opacity={0.5}>
            {timeAgo}
          </Text>
        </XStack>

        {/* Student context */}
        {conversation.student && (
          <Text fontSize={smallSize} color="$primary" opacity={0.8}>
            Sobre: {conversation.student.name}
          </Text>
        )}

        {/* Last message */}
        <XStack ai="center" jc="space-between">
          <Text
            fontSize={textSize}
            color="$color"
            opacity={unreadCount > 0 ? 0.9 : 0.6}
            fontWeight={unreadCount > 0 ? "500" : "400"}
            numberOfLines={1}
            f={1}
          >
            {lastMessage?.content || "Nenhuma mensagem ainda"}
          </Text>

          {/* Read status / Unread badge */}
          {unreadCount > 0 ? (
            <YStack
              bg="$primary"
              px="$2"
              py="$1"
              br="$4"
              minWidth={24}
              ai="center"
            >
              <Text color="white" fontSize={12} fontWeight="bold">
                {unreadCount}
              </Text>
            </YStack>
          ) : lastMessage?.status === "read" ? (
            <Text fontSize={smallSize} color="$success">
              ✓✓
            </Text>
          ) : lastMessage?.status === "delivered" ? (
            <Text fontSize={smallSize} color="$color" opacity={0.5}>
              ✓✓
            </Text>
          ) : (
            <Text fontSize={smallSize} color="$color" opacity={0.5}>
              ✓
            </Text>
          )}
        </XStack>
      </YStack>
    </XStack>
  );
}
