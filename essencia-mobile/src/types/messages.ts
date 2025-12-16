export interface Conversation {
  id: string;
  tenantId: string;
  participant1Id: string;
  participant2Id: string;
  studentId: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  otherParticipant?: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string;
  };
  student?: {
    id: string;
    name: string;
  };
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  tenantId: string;
  conversationId: string;
  senderId: string;
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;
  deliveredAt: string | null;
  readAt: string | null;
  sender?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface CreateConversationRequest {
  participantId: string;
  studentId?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

// WebSocket events
export interface MessageReceivedEvent {
  message: Message;
  conversationId: string;
}

export interface MessageReadEvent {
  messageId: string;
  conversationId: string;
  readAt: string;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}
