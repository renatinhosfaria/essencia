"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  studentId?: string;
  lastMessageAt?: string;
  createdAt: string;
  otherParticipant: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: string;
  };
  student?: {
    id: string;
    name: string;
    className?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    status: string;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get("/messages/conversations");
      return data.data;
    },
  });
}

export function useMessages(conversationId: string) {
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data } = await api.get(
        `/messages/conversations/${conversationId}/messages`
      );
      return data.data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      const { data } = await api.post(
        `/messages/conversations/${conversationId}/messages`,
        { content }
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { data } = await api.patch(
        `/messages/conversations/${conversationId}/read`
      );
      return data.data;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      participant2Id,
      studentId,
    }: {
      participant2Id: string;
      studentId?: string;
    }) => {
      const { data } = await api.post("/messages/conversations", {
        participant2Id,
        studentId,
      });
      return data.data as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
