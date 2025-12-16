"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useConversations,
  useCreateConversation,
  useMarkAsRead,
  useMessages,
  useSendMessage,
  type Conversation,
} from "@/hooks/use-messages";
import { useStudents } from "@/hooks/use-students";
import { useUsers } from "@/hooks/use-users";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Send,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewConversationDialog, setShowNewConversationDialog] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // API hooks
  const { data: conversations = [], isLoading: isLoadingConversations } =
    useConversations();
  const { data: messages = [], isLoading: isLoadingMessages } = useMessages(
    selectedConversation?.id || ""
  );
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: students = [], isLoading: isLoadingStudents } = useStudents();
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const createConversation = useCreateConversation();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (
      selectedConversation?.unreadCount &&
      selectedConversation.unreadCount > 0
    ) {
      markAsRead.mutate(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.otherParticipant.name.toLowerCase().includes(search.toLowerCase()) ||
      (conv.student?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const availableUsers = users.filter(
    (user) =>
      user.isActive &&
      !conversations.map((c) => c.otherParticipant.id).includes(user.id) &&
      user.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleCreateConversation = () => {
    if (!selectedUserId) return;

    createConversation.mutate(
      {
        participant2Id: selectedUserId,
        studentId: selectedStudentId || undefined,
      },
      {
        onSuccess: (newConv) => {
          setShowNewConversationDialog(false);
          setSelectedUserId("");
          setSelectedStudentId("");
          setUserSearch("");
          setSelectedConversation(newConv);
        },
      }
    );
  };

  const handleSendMessage = () => {
    if (selectedConversation && newMessage.trim()) {
      sendMessage.mutate(
        {
          conversationId: selectedConversation.id,
          content: newMessage.trim(),
        },
        {
          onSuccess: () => setNewMessage(""),
        }
      );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hours < 48) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  return (
    <ProtectedRoute resource="messages">
      <div className="h-[calc(100vh-2rem)] flex flex-col gap-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold">Mensagens</h1>
            <p className="text-muted-foreground hidden sm:block">
              Comunicação direta com os responsáveis
            </p>
          </div>
          <Button
            className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black"
            onClick={() => setShowNewConversationDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nova Conversa</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden min-h-0">
          {/* Left Column: List */}
          <Card
            className={cn(
              "md:col-span-4 lg:col-span-3 flex flex-col h-full overflow-hidden",
              selectedConversation ? "hidden md:flex" : "flex"
            )}
          >
            <CardHeader className="p-4 border-b shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversa..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Nenhuma conversa encontrada
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={cn(
                        "flex items-start gap-3 p-4 text-left transition-colors border-b last:border-0 hover:bg-muted/50",
                        selectedConversation?.id === conversation.id &&
                          "bg-[#CEDE6C]/10 hover:bg-[#CEDE6C]/20 border-l-4 border-l-[#CEDE6C]"
                      )}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <Avatar>
                        <AvatarImage
                          src={conversation.otherParticipant.avatarUrl}
                        />
                        <AvatarFallback>
                          {conversation.otherParticipant.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            {conversation.otherParticipant.name}
                          </span>
                          {conversation.lastMessageAt && (
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatTime(conversation.lastMessageAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate line-clamp-1">
                          {conversation.lastMessage?.content ||
                            "Inicie a conversa..."}
                        </p>
                        {conversation.student && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">
                              {conversation.student.name}
                            </span>
                          </div>
                        )}
                      </div>
                      {!!conversation.unreadCount &&
                        conversation.unreadCount > 0 && (
                          <Badge className="bg-[#F29131] h-5 w-5 rounded-full p-0 flex items-center justify-center shrink-0">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Chat */}
          <Card
            className={cn(
              "md:col-span-8 lg:col-span-9 flex flex-col h-full overflow-hidden",
              !selectedConversation ? "hidden md:flex" : "flex"
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3 shrink-0 bg-card z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden -ml-2"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={selectedConversation.otherParticipant.avatarUrl}
                    />
                    <AvatarFallback>
                      {selectedConversation.otherParticipant.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedConversation.otherParticipant.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.student
                        ? `Responsável por ${selectedConversation.student.name}`
                        : selectedConversation.otherParticipant.role}
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-hidden relative bg-muted/20">
                  <div
                    ref={scrollRef}
                    className="absolute inset-0 overflow-y-auto p-4 space-y-4"
                  >
                    {isLoadingMessages ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                        <MessageCircle className="h-12 w-12 opacity-20" />
                        <p>Nenhuma mensagem ainda.</p>
                        <p className="text-sm">Envie a primeira mensagem!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMe =
                          msg.senderId !==
                          selectedConversation.otherParticipant.id;
                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex max-w-[80%]",
                              isMe
                                ? "ml-auto justify-end"
                                : "mr-auto justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "p-3 rounded-2xl text-sm shadow-sm",
                                isMe
                                  ? "bg-[#CEDE6C] text-black rounded-tr-none"
                                  : "bg-white dark:bg-card text-foreground rounded-tl-none border"
                              )}
                            >
                              <p>{msg.content}</p>
                              <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                                <span className="text-[10px]">
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                                {isMe && msg.status === "read" && (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t bg-card shrink-0">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[2.5rem] max-h-32 resize-none"
                      rows={1}
                    />
                    <Button
                      className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black h-[2.5rem] w-[2.5rem] p-0 shrink-0"
                      onClick={handleSendMessage}
                      disabled={sendMessage.isPending || !newMessage.trim()}
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/10">
                <MessageCircle className="h-16 w-16 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Selecione uma conversa</h3>
                <p className="text-sm">
                  Escolha um contato à esquerda para visualizar as mensagens
                </p>
              </div>
            )}
          </Card>
        </div>

        <Dialog
          open={showNewConversationDialog}
          onOpenChange={setShowNewConversationDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conversa</DialogTitle>
              <DialogDescription>
                Inicie um chat com um responsável, professor ou secretaria.
              </DialogDescription>
            </DialogHeader>
            {/* Reuse existing logic for new conversation dialog body */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Buscar usuário..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {isLoadingUsers ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : availableUsers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground p-4">
                    Nenhum usuário encontrado.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {availableUsers.map((user) => (
                      <button
                        key={user.id}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left text-sm",
                          selectedUserId === user.id && "bg-[#CEDE6C]/20"
                        )}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.role}
                          </p>
                        </div>
                        {selectedUserId === user.id && (
                          <CheckCircle className="h-4 w-4 text-[#CEDE6C]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewConversationDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#CEDE6C] text-black hover:bg-[#CEDE6C]/90"
                disabled={!selectedUserId || createConversation.isPending}
                onClick={handleCreateConversation}
              >
                {createConversation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Iniciar Conversa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
