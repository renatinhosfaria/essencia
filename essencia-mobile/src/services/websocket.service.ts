import { env } from "@/config/env";
import { Message, MessageReadEvent, TypingEvent } from "@/types/messages";
import * as SecureStore from "expo-secure-store";
import { io, Socket } from "socket.io-client";

type MessageHandler = (message: Message) => void;
type ReadHandler = (event: MessageReadEvent) => void;
type TypingHandler = (event: TypingEvent) => void;
type ConnectHandler = () => void;
type DisconnectHandler = () => void;

class WebSocketService {
  private socket: Socket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private readHandlers: Set<ReadHandler> = new Set();
  private typingHandlers: Set<TypingHandler> = new Set();
  private connectHandlers: Set<ConnectHandler> = new Set();
  private disconnectHandlers: Set<DisconnectHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private userId: string | null = null;
  private tenantId: string | null = null;
  private joinedConversations: Set<string> = new Set();

  async connect(userId: string, tenantId: string): Promise<void> {
    this.userId = userId;
    this.tenantId = tenantId;

    if (this.socket?.connected) {
      return;
    }

    const token = await SecureStore.getItemAsync("accessToken");

    this.socket = io(`${env.wsUrl}/messages`, {
      auth: {
        userId,
        tenantId,
        token,
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("🔌 WebSocket connected");
      this.reconnectAttempts = 0;

      if (this.userId && this.tenantId) {
        this.socket?.emit("join", { userId: this.userId, tenantId: this.tenantId });
      }

      for (const conversationId of this.joinedConversations) {
        this.socket?.emit("joinConversation", { conversationId });
      }

      this.connectHandlers.forEach((handler) => handler());
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("🔌 WebSocket disconnected:", reason);
      this.disconnectHandlers.forEach((handler) => handler());
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("🔌 WebSocket connection error:", error);
      this.reconnectAttempts++;
    });

    // Message received
    this.socket.on("newMessage", (message: Message) => {
      console.log("📨 Message received:", message.id);
      this.messageHandlers.forEach((handler) => handler(message));
    });

    // Message read
    this.socket.on("message:read", (event: MessageReadEvent) => {
      console.log("✓✓ Message read:", event.messageId);
      this.readHandlers.forEach((handler) => handler(event));
    });

    // Typing indicator
    this.socket.on(
      "userTyping",
      (event: { conversationId: string; userId: string }) => {
        this.typingHandlers.forEach((handler) =>
          handler({
            conversationId: event.conversationId,
            userId: event.userId,
            isTyping: true,
          })
        );
      }
    );

    this.socket.on(
      "userStoppedTyping",
      (event: { conversationId: string; userId: string }) => {
        this.typingHandlers.forEach((handler) =>
          handler({
            conversationId: event.conversationId,
            userId: event.userId,
            isTyping: false,
          })
        );
      }
    );

    this.socket.on("typing", (event: TypingEvent) => {
      this.typingHandlers.forEach((handler) => handler(event));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.joinedConversations.clear();
    }
  }

  joinConversation(conversationId: string): void {
    this.joinedConversations.add(conversationId);
    if (this.socket?.connected) {
      this.socket.emit("joinConversation", { conversationId });
    }
  }

  leaveConversation(conversationId: string): void {
    this.joinedConversations.delete(conversationId);
    if (this.socket?.connected) {
      this.socket.emit("leaveConversation", { conversationId });
    }
  }

  // Send message via WebSocket
  sendMessage(conversationId: string, content: string): void {
    if (this.socket?.connected && this.userId && this.tenantId) {
      this.socket.emit("sendMessage", {
        tenantId: this.tenantId,
        conversationId,
        senderId: this.userId,
        content,
      });
    }
  }

  // Send typing indicator
  sendTyping(conversationId: string, isTyping: boolean): void {
    if (this.socket?.connected && this.userId) {
      if (isTyping) {
        this.socket.emit("typing", { conversationId, userId: this.userId });
      } else {
        this.socket.emit("stopTyping", { conversationId, userId: this.userId });
      }
    }
  }

  // Mark messages as read
  markAsRead(conversationId: string, messageIds: string[]): void {
    if (this.socket?.connected) {
      this.socket.emit("message:read", { conversationId, messageIds });
    }
  }

  // Event handlers
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onRead(handler: ReadHandler): () => void {
    this.readHandlers.add(handler);
    return () => this.readHandlers.delete(handler);
  }

  onTyping(handler: TypingHandler): () => void {
    this.typingHandlers.add(handler);
    return () => this.typingHandlers.delete(handler);
  }

  onConnect(handler: ConnectHandler): () => void {
    this.connectHandlers.add(handler);
    return () => this.connectHandlers.delete(handler);
  }

  onDisconnect(handler: DisconnectHandler): () => void {
    this.disconnectHandlers.add(handler);
    return () => this.disconnectHandlers.delete(handler);
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const wsService = new WebSocketService();
