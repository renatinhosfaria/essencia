import { useAuth } from "@/contexts/AuthContext";
import { messagesService } from "@/services/messages.service";
import { wsService } from "@/services/websocket.service";
import { Conversation, Message, SendMessageRequest } from "@/types/messages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: () => messagesService.getConversations(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: () => messagesService.getMessages(conversationId!, { limit: 50 }),
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 segundos
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SendMessageRequest) =>
      messagesService.sendMessage(request),
    onSuccess: (newMessage) => {
      // Atualiza cache de mensagens
      queryClient.setQueryData<Message[]>(
        ["messages", newMessage.conversationId],
        (old) => (old ? [...old, newMessage] : [newMessage])
      );

      // Atualiza lista de conversas
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkAsRead(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageIds: string[]) =>
      messagesService.markAsRead(conversationId, messageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useWebSocket() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    if (!user) return;

    wsService.connect(user.id, user.tenantId);

    const unsubConnect = wsService.onConnect(() => {
      setIsConnected(true);
    });

    const unsubDisconnect = wsService.onDisconnect(() => {
      setIsConnected(false);
    });

    const unsubMessage = wsService.onMessage((message) => {
      // Atualiza cache de mensagens
      queryClient.setQueryData<Message[]>(
        ["messages", message.conversationId],
        (old) => {
          const list = old ?? [];
          if (list.some((m) => m.id === message.id)) return list;
          return [...list, message];
        }
      );

      // Atualiza lista de conversas
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    const unsubRead = wsService.onRead((event) => {
      queryClient.setQueryData<Message[]>(
        ["messages", event.conversationId],
        (old) =>
          old?.map((msg) =>
            msg.id === event.messageId
              ? { ...msg, status: "read" as const, readAt: event.readAt }
              : msg
          )
      );
    });

    const unsubTyping = wsService.onTyping((event) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (event.isTyping) {
          next.set(event.conversationId, event.userId);
        } else {
          next.delete(event.conversationId);
        }
        return next;
      });
    });

    return () => {
      unsubConnect();
      unsubDisconnect();
      unsubMessage();
      unsubRead();
      unsubTyping();
      wsService.disconnect();
    };
  }, [user, queryClient]);

  const sendTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      wsService.sendTyping(conversationId, isTyping);
    },
    []
  );

  return {
    isConnected,
    typingUsers,
    sendTyping,
  };
}
