"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useClasses } from "@/hooks/use-classes";
import {
  useCreateGalleryPost,
  useDeleteGalleryPost,
  useGalleryPosts,
  type GalleryPost,
} from "@/hooks/use-gallery";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle,
  Eye,
  Grid,
  Image as ImageIcon,
  List,
  Loader2,
  Plus,
  Search,
  Trash,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "", classId: "" });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // API hooks
  const { data: galleryPosts = [], isLoading: isLoadingGallery } =
    useGalleryPosts();
  const { data: classes = [], isLoading: isLoadingClasses } = useClasses();
  const createGalleryPost = useCreateGalleryPost();
  const deleteGalleryPost = useDeleteGalleryPost();

  const filteredItems = galleryPosts.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalAlbums = galleryPosts.length;
  const totalVideos = galleryPosts.filter((p) =>
    p.mediaItems?.some((m) => m.type === "video")
  ).length;
  const totalMedia = galleryPosts.reduce(
    (sum, item) => sum + (item.mediaItems?.length || 0),
    0
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleCreateAlbum = () => {
    if (newAlbum.title && newAlbum.classId) {
      createGalleryPost.mutate(
        { title: newAlbum.title, classId: newAlbum.classId },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setNewAlbum({ title: "", classId: "" });
          },
        }
      );
    }
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este álbum?")) {
      deleteGalleryPost.mutate(id);
    }
  };

  const getThumbnail = (post: GalleryPost) => {
    if (post.mediaItems?.length > 0) {
      return post.mediaItems[0].thumbnailUrl || post.mediaItems[0].url;
    }
    return `https://picsum.photos/seed/${post.id}/400/300`;
  };

  return (
    <ProtectedRoute resource="gallery">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Galeria</h1>
            <p className="text-muted-foreground">
              Gerencie fotos e vídeos para compartilhar com os responsáveis
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Novo Álbum
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Álbum</DialogTitle>
                <DialogDescription>
                  Adicione fotos e vídeos para compartilhar
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título do Álbum</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Festa de Carnaval 2025"
                    value={newAlbum.title}
                    onChange={(e) =>
                      setNewAlbum((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Turma</Label>
                  <Select
                    value={newAlbum.classId}
                    onValueChange={(value: string) =>
                      setNewAlbum((prev) => ({ ...prev, classId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingClasses ? (
                        <SelectItem value="" disabled>
                          Carregando...
                        </SelectItem>
                      ) : (
                        classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Upload de Mídia</Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                      isDragging
                        ? "border-[#CEDE6C] bg-[#CEDE6C]/10"
                        : "border-muted hover:border-[#CEDE6C]/50"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      simulateUpload();
                    }}
                    onClick={simulateUpload}
                  >
                    {uploadProgress > 0 && uploadProgress < 100 ? (
                      <div className="space-y-4">
                        <Loader2 className="h-10 w-10 mx-auto text-[#CEDE6C] animate-spin" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Enviando arquivos...
                          </p>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#CEDE6C] transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {uploadProgress}%
                          </p>
                        </div>
                      </div>
                    ) : uploadProgress === 100 ? (
                      <div className="space-y-2">
                        <div className="h-10 w-10 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-600">
                          Upload concluído!
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 arquivos selecionados
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Arraste arquivos ou clique para selecionar
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Suporta: JPG, PNG, GIF, MP4 (máx 50MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black"
                  onClick={handleCreateAlbum}
                  disabled={
                    createGalleryPost.isPending ||
                    !newAlbum.title ||
                    !newAlbum.classId ||
                    (uploadProgress > 0 && uploadProgress < 100)
                  }
                >
                  {createGalleryPost.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Álbum"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Álbuns
              </CardTitle>
              <ImageIcon className="h-5 w-5 text-[#CEDE6C]" />
            </CardHeader>
            <CardContent>
              {isLoadingGallery ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{totalAlbums}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Com Vídeos
              </CardTitle>
              <Video className="h-5 w-5 text-[#F29131]" />
            </CardHeader>
            <CardContent>
              {isLoadingGallery ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{totalVideos}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Mídias
              </CardTitle>
              <Grid className="h-5 w-5 text-[#3B82F6]" />
            </CardHeader>
            <CardContent>
              {isLoadingGallery ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{totalMedia}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Álbuns este mês
              </CardTitle>
              <Eye className="h-5 w-5 text-[#22C55E]" />
            </CardHeader>
            <CardContent>
              {isLoadingGallery ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">
                  {
                    galleryPosts.filter((p) => {
                      const now = new Date();
                      const postDate = new Date(p.createdAt);
                      return (
                        postDate.getMonth() === now.getMonth() &&
                        postDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar álbuns..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoadingGallery ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {search ? "Nenhum álbum encontrado" : "Nenhum álbum criado ainda"}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const hasVideos = item.mediaItems?.some(
                (m) => m.type === "video"
              );
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden group cursor-pointer"
                >
                  <div className="relative aspect-video">
                    <img
                      src={getThumbnail(item)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/70 text-white">
                        {hasVideos ? (
                          <>
                            <Video className="mr-1 h-3 w-3" />
                            Vídeo
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-1 h-3 w-3" />
                            {item.mediaItems?.length || 0} fotos
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>{item.className || "Todas as turmas"}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredItems.map((item) => {
                  const hasVideos = item.mediaItems?.some(
                    (m) => m.type === "video"
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="relative w-24 h-16 rounded overflow-hidden shrink-0">
                        <img
                          src={getThumbnail(item)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {hasVideos && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.className || "Todas as turmas"} •{" "}
                          {item.mediaItems?.length || 0} mídias
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(item.id);
                          }}
                          disabled={deleteGalleryPost.isPending}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
