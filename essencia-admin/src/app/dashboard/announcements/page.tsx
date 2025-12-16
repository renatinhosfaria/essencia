"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  usePublishAnnouncement,
  type Announcement,
} from "@/hooks/use-announcements";
import { useClasses } from "@/hooks/use-classes";
import {
  Bell,
  CheckCircle,
  Edit,
  Eye,
  Loader2,
  Plus,
  Search,
  Send,
  Trash,
  Users,
} from "lucide-react";
import { useState } from "react";

const priorities = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export default function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<{
    title: string;
    content: string;
    targetAudience: "all" | "specific_classes" | "specific_students";
    targetClassIds: string[];
    priority: "normal" | "high" | "urgent";
  }>({
    title: "",
    content: "",
    targetAudience: "all",
    targetClassIds: [],
    priority: "normal",
  });

  // API hooks
  const { data: announcements = [], isLoading: isLoadingAnnouncements } =
    useAnnouncements();
  const { data: classes = [] } = useClasses();
  const createAnnouncement = useCreateAnnouncement();
  const publishAnnouncement = usePublishAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const filteredAnnouncements = announcements.filter((ann) =>
    ann.title.toLowerCase().includes(search.toLowerCase())
  );

  const sentCount = announcements.filter((a) => a.publishedAt).length;
  const draftCount = announcements.filter((a) => !a.publishedAt).length;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTargetLabel = (announcement: Announcement) => {
    if (announcement.targetAudience === "all") return "Todos";
    if (announcement.targetClassIds?.length) {
      const classNames = announcement.targetClassIds
        .map((id) => classes.find((c) => c.id === id)?.name)
        .filter(Boolean);
      return classNames.length > 0
        ? classNames.join(", ")
        : "Turmas específicas";
    }
    return "Alunos específicos";
  };

  const handleCreate = (publishNow: boolean) => {
    createAnnouncement.mutate(
      {
        ...newAnnouncement,
        publishNow,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setNewAnnouncement({
            title: "",
            content: "",
            targetAudience: "all",
            targetClassIds: [],
            priority: "normal",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este comunicado?")) {
      deleteAnnouncement.mutate(id);
    }
  };

  return (
    <ProtectedRoute resource="announcements">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Comunicados</h1>
            <p className="text-muted-foreground">
              Envie e gerencie comunicados para os responsáveis
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Novo Comunicado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Comunicado</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do comunicado
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Título do comunicado"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    placeholder="Digite o conteúdo do comunicado..."
                    className="min-h-40"
                    value={newAnnouncement.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewAnnouncement((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Destinatários</Label>
                    <Select
                      value={newAnnouncement.targetAudience}
                      onValueChange={(value: "all" | "specific_classes") =>
                        setNewAnnouncement((prev) => ({
                          ...prev,
                          targetAudience: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="specific_classes">
                          Turmas específicas
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Prioridade</Label>
                    <Select
                      value={newAnnouncement.priority}
                      onValueChange={(value: "normal" | "high" | "urgent") =>
                        setNewAnnouncement((prev) => ({
                          ...prev,
                          priority: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreate(false)}
                  disabled={
                    createAnnouncement.isPending ||
                    !newAnnouncement.title ||
                    !newAnnouncement.content
                  }
                >
                  {createAnnouncement.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Edit className="mr-2 h-4 w-4" />
                  )}
                  Salvar Rascunho
                </Button>
                <Button
                  className="bg-[#F29131] hover:bg-[#F29131]/90 text-white"
                  onClick={() => handleCreate(true)}
                  disabled={
                    createAnnouncement.isPending ||
                    !newAnnouncement.title ||
                    !newAnnouncement.content
                  }
                >
                  {createAnnouncement.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Enviar Agora
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Comunicados
              </CardTitle>
              <Bell className="h-5 w-5 text-[#CEDE6C]" />
            </CardHeader>
            <CardContent>
              {isLoadingAnnouncements ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{announcements.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Enviados
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              {isLoadingAnnouncements ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{sentCount}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rascunhos
              </CardTitle>
              <Edit className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              {isLoadingAnnouncements ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{draftCount}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar comunicados..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {isLoadingAnnouncements ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {search
                ? "Nenhum comunicado encontrado"
                : "Nenhum comunicado criado ainda"}
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          {announcement.title}
                        </CardTitle>
                        <StatusBadge
                          status={
                            announcement.priority === "urgent"
                              ? "error"
                              : announcement.priority === "high"
                              ? "warning"
                              : "inactive"
                          }
                          label={
                            announcement.priority === "urgent"
                              ? "Urgente"
                              : announcement.priority === "high"
                              ? "Importante"
                              : "Normal"
                          }
                        />
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {getTargetLabel(announcement)}
                        </span>
                        {announcement.publishedAt &&
                          announcement.readCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {announcement.readCount}/
                              {announcement.totalRecipients || 0} visualizaram
                            </span>
                          )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {announcement.publishedAt ? (
                        <StatusBadge status="sent" />
                      ) : (
                        <StatusBadge status="draft" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {announcement.publishedAt
                        ? `Enviado em ${formatDate(announcement.publishedAt)}`
                        : `Criado em ${formatDate(announcement.createdAt)}`}
                    </span>
                    <div className="flex gap-2">
                      {!announcement.publishedAt && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            publishAnnouncement.mutate(announcement.id)
                          }
                          disabled={publishAnnouncement.isPending}
                        >
                          {publishAnnouncement.isPending ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="mr-1 h-4 w-4" />
                          )}
                          Enviar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDelete(announcement.id)}
                        disabled={deleteAnnouncement.isPending}
                      >
                        <Trash className="mr-1 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
