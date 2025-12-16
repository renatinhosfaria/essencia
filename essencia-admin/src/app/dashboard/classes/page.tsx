"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useClasses,
  useCreateClass,
  useDeleteClass,
} from "@/hooks/use-classes";
import {
  BookOpen,
  Clock,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash,
  Users,
} from "lucide-react";
import { useState } from "react";

const shifts = [
  { value: "morning", label: "Manhã" },
  { value: "afternoon", label: "Tarde" },
  { value: "full", label: "Integral" },
];

const getShiftLabel = (shift: string) => {
  return shifts.find((s) => s.value === shift)?.label || shift;
};

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState<{
    name: string;
    grade: string;
    year: number;
    shift: "morning" | "afternoon" | "full";
  }>({
    name: "",
    grade: "",
    year: new Date().getFullYear(),
    shift: "morning",
  });

  // API hooks
  const { data: classes = [], isLoading: isLoadingClasses } = useClasses();
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = classes.reduce(
    (sum, cls) => sum + (cls.studentCount || 0),
    0
  );
  const activeClasses = classes.filter((cls) => cls.status === "active").length;

  const handleCreate = () => {
    if (newClass.name && newClass.grade) {
      createClass.mutate(newClass, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setNewClass({
            name: "",
            grade: "",
            year: new Date().getFullYear(),
            shift: "morning",
          });
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      deleteClass.mutate(id);
    }
  };

  return (
    <ProtectedRoute resource="classes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Turmas</h1>
            <p className="text-muted-foreground">
              Gerencie as turmas da escola
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Turma</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova turma
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Turma</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Maternal I"
                    value={newClass.name}
                    onChange={(e) =>
                      setNewClass((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Série/Nível</Label>
                  <Input
                    id="grade"
                    placeholder="Ex: Berçário, Maternal, Pré-Escola"
                    value={newClass.grade}
                    onChange={(e) =>
                      setNewClass((prev) => ({
                        ...prev,
                        grade: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shift">Turno</Label>
                  <Select
                    value={newClass.shift}
                    onValueChange={(value: "morning" | "afternoon" | "full") =>
                      setNewClass((prev) => ({ ...prev, shift: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift.value} value={shift.value}>
                          {shift.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Ano Letivo</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newClass.year}
                    onChange={(e) =>
                      setNewClass((prev) => ({
                        ...prev,
                        year:
                          parseInt(e.target.value) || new Date().getFullYear(),
                      }))
                    }
                  />
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
                  onClick={handleCreate}
                  disabled={
                    createClass.isPending || !newClass.name || !newClass.grade
                  }
                >
                  {createClass.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Turma"
                  )}
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
                Total de Turmas
              </CardTitle>
              <BookOpen className="h-5 w-5 text-[#CEDE6C]" />
            </CardHeader>
            <CardContent>
              {isLoadingClasses ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{classes.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Turmas Ativas
              </CardTitle>
              <Clock className="h-5 w-5 text-[#22C55E]" />
            </CardHeader>
            <CardContent>
              {isLoadingClasses ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{activeClasses}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Alunos
              </CardTitle>
              <Users className="h-5 w-5 text-[#F29131]" />
            </CardHeader>
            <CardContent>
              {isLoadingClasses ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{totalStudents}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Turmas</CardTitle>
            <CardDescription>
              Visualize e gerencie todas as turmas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por turma ou professor..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Série/Nível</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingClasses ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {search
                        ? "Nenhuma turma encontrada"
                        : "Nenhuma turma cadastrada"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.grade}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            cls.shift === "morning"
                              ? "border-[#CEDE6C] text-[#CEDE6C]"
                              : cls.shift === "afternoon"
                              ? "border-[#F29131] text-[#F29131]"
                              : "border-[#3B82F6] text-[#3B82F6]"
                          }
                        >
                          {getShiftLabel(cls.shift)}
                        </Badge>
                      </TableCell>
                      <TableCell>{cls.year}</TableCell>
                      <TableCell>{cls.studentCount || 0}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            cls.status === "active" ? "active" : "inactive"
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cls.id)}
                            disabled={deleteClass.isPending}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
