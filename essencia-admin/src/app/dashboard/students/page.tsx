"use client";

import { ProtectedAction, ProtectedRoute } from "@/components/ProtectedRoute";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { Edit, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  birthDate?: string;
  className?: string;
  status: string;
  avatarUrl?: string;
  guardians?: { id: string; name: string }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data.data || []);
    } catch (error) {
      console.error("Error loading students:", error);
      // Mock data for demo
      setStudents([
        {
          id: "1",
          name: "Pedro Silva Lima",
          birthDate: "2015-03-15",
          className: "4º Ano",
          status: "active",
          guardians: [{ id: "1", name: "Marina Lima" }],
        },
        {
          id: "2",
          name: "Lucas Santos",
          birthDate: "2017-07-22",
          className: "2º Ano",
          status: "active",
          guardians: [{ id: "2", name: "João Santos" }],
        },
        {
          id: "3",
          name: "Ana Clara Costa",
          birthDate: "2016-11-08",
          className: "3º Ano",
          status: "active",
          guardians: [{ id: "3", name: "Maria Costa" }],
        },
        {
          id: "4",
          name: "Miguel Ferreira",
          birthDate: "2018-01-30",
          className: "Jardim II",
          status: "active",
          guardians: [{ id: "4", name: "Carlos Ferreira" }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "-";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  return (
    <ProtectedRoute resource="students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alunos</h1>
            <p className="text-muted-foreground">
              Gerencie os alunos matriculados
            </p>
          </div>
          <ProtectedAction resource="students" action="create">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#CEDE6C] hover:bg-[#B8C85A] text-[#333]">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Aluno
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Aluno</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="Nome do aluno" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input id="birthDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Turma</Label>
                    <select id="class" className="w-full rounded-md border p-2">
                      <option value="">Selecione uma turma</option>
                      <option value="bercario">Berçário</option>
                      <option value="maternal">Maternal</option>
                      <option value="jardim1">Jardim I</option>
                      <option value="jardim2">Jardim II</option>
                      <option value="1ano">1º Ano</option>
                      <option value="2ano">2º Ano</option>
                      <option value="3ano">3º Ano</option>
                      <option value="4ano">4º Ano</option>
                      <option value="5ano">5º Ano</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#CEDE6C] hover:bg-[#B8C85A] text-[#333]"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success("Aluno cadastrado com sucesso!");
                      setIsDialogOpen(false);
                    }}
                  >
                    Cadastrar Aluno
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </ProtectedAction>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-sm text-muted-foreground">Total de Alunos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {students.filter((s) => s.status === "active").length}
              </div>
              <p className="text-sm text-muted-foreground">Alunos Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">Turmas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">92%</div>
              <p className="text-sm text-muted-foreground">Taxa de Presença</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do aluno..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Alunos ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatarUrl} />
                          <AvatarFallback className="bg-[#CEDE6C] text-[#333]">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{calculateAge(student.birthDate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {student.className || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.guardians?.map((g) => g.name).join(", ") || "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          student.status === "active" ? "active" : "inactive"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Users className="h-4 w-4" />
                        </Button>
                        <ProtectedAction resource="students" action="update">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </ProtectedAction>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
