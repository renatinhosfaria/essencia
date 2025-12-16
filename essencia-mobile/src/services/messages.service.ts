import {
  Conversation,
  CreateConversationRequest,
  Message,
  SendMessageRequest,
} from "@/types/messages";
import api from "./api";

export const messagesService = {
  /**
   * Buscar todas as conversas do usuário
   */
  async getConversations(): Promise<Conversation[]> {
    const { data } = await api.get<{ data: Conversation[] }>(
      "/messages/conversations"
    );
    return data.data;
  },

  /**
   * Criar ou obter conversa com outro usuário
   */
  async createConversation(
    request: CreateConversationRequest
  ): Promise<Conversation> {
    const { data } = await api.post<{ data: Conversation }>(
      "/messages/conversations",
      request
    );
    return data.data;
  },

  /**
   * Buscar mensagens de uma conversa
   */
  async getMessages(
    conversationId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<Message[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const { data } = await api.get<{ data: Message[] }>(
      `/messages/conversations/${conversationId}/messages?${params.toString()}`
    );
    return data.data;
  },

  /**
   * Enviar mensagem
   */
  async sendMessage(request: SendMessageRequest): Promise<Message> {
    const { data } = await api.post<{ data: Message }>(
      "/messages/send",
      request
    );
    return data.data;
  },

  /**
   * Marcar mensagens como lidas
   */
  async markAsRead(
    conversationId: string,
    messageIds: string[]
  ): Promise<void> {
    await api.patch(`/messages/conversations/${conversationId}/read`, {
      messageIds,
    });
  },

  /**
   * Buscar contagem de mensagens não lidas
   */
  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ data: { count: number } }>(
      "/messages/unread-count"
    );
    return data.data.count;
  },
};
