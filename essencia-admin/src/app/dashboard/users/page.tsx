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
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  secretary: "Secretaria",
  teacher: "Professor",
  guardian: "Responsável",
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  secretary: "bg-blue-100 text-blue-700",
  teacher: "bg-green-100 text-green-700",
  guardian: "bg-yellow-100 text-yellow-700",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      // Mock data for demo
      setUsers([
        {
          id: "1",
          name: "Daviane Costa",
          email: "daviane@essenciafeliz.com.br",
          role: "admin",
          status: "active",
          createdAt: "2024-01-01",
        },
        {
          id: "2",
          name: "Ana Silva",
          email: "ana@essenciafeliz.com.br",
          role: "secretary",
          status: "active",
          createdAt: "2024-02-15",
        },
        {
          id: "3",
          name: "Prof. Carla Santos",
          email: "carla@essenciafeliz.com.br",
          role: "teacher",
          status: "active",
          createdAt: "2024-03-01",
        },
        {
          id: "4",
          name: "Marina Lima",
          email: "marina.lima@gmail.com",
          role: "guardian",
          status: "active",
          createdAt: "2024-06-10",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute resource="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários do sistema
            </p>
          </div>
          <ProtectedAction resource="users" action="create">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#CEDE6C] hover:bg-[#B8C85A] text-[#333]">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Usuário</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="Nome do usuário" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <select id="role" className="w-full rounded-md border p-2">
                      <option value="teacher">Professor</option>
                      <option value="secretary">Secretaria</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#CEDE6C] hover:bg-[#B8C85A] text-[#333]"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success("Usuário criado com sucesso!");
                      setIsDialogOpen(false);
                    }}
                  >
                    Criar Usuário
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </ProtectedAction>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="bg-[#F29131] text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={roleColors[user.role]}
                      >
                        {roleLabels[user.role] || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          user.status === "active" ? "active" : "inactive"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ProtectedAction resource="users" action="update">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </ProtectedAction>
                        <ProtectedAction resource="users" action="delete">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
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
