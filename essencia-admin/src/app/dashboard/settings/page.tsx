"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Building2,
  Mail,
  MapPin,
  Palette,
  Phone,
  Save,
  Shield,
  Upload,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [schoolName, setSchoolName] = useState("Colégio Essência Feliz");
  const [email, setEmail] = useState("contato@essenciafeliz.com.br");
  const [phone, setPhone] = useState("(11) 99999-9999");
  const [address, setAddress] = useState("Rua das Flores, 123 - São Paulo, SP");
  const [description, setDescription] = useState(
    "Educação infantil de qualidade, desenvolvendo o potencial de cada criança com amor e dedicação."
  );

  return (
    <ProtectedRoute resource="settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Configure as preferências do sistema e informações da escola
          </p>
        </div>

        <Tabs defaultValue="school" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="school">
              <Building2 className="mr-2 h-4 w-4" />
              Escola
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* School Settings */}
          <TabsContent value="school" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Escola</CardTitle>
                <CardDescription>
                  Dados básicos que aparecem no app e landing page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-[#CEDE6C] flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="schoolName">Nome da Escola</Label>
                    <Input
                      id="schoolName"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cores do Tema</CardTitle>
                <CardDescription>
                  Personalize as cores da marca da escola
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label>Cor Primária (Verde Lima)</Label>
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-12 rounded-lg border"
                        style={{ backgroundColor: "#CEDE6C" }}
                      />
                      <Input value="#CEDE6C" className="font-mono" readOnly />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Cor Secundária (Laranja)</Label>
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-12 rounded-lg border"
                        style={{ backgroundColor: "#F29131" }}
                      />
                      <Input value="#F29131" className="font-mono" readOnly />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="flex gap-4">
                    <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                      Botão Primário
                    </Button>
                    <Button className="bg-[#F29131] hover:bg-[#F29131]/90 text-white">
                      Botão Secundário
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#CEDE6C] text-[#CEDE6C]"
                    >
                      Outline
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure quando e como as notificações são enviadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber resumo diário por e-mail
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações em tempo real no navegador
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alertas de Mensagens</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar quando receber novas mensagens
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Relatórios Semanais</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber relatório de métricas semanalmente
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>
                  Gerencie a segurança da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Nova Senha
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">
                    Autenticação em Duas Etapas
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança à sua conta
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Sessões Ativas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Chrome - Windows</p>
                        <p className="text-sm text-muted-foreground">
                          São Paulo, BR • Sessão atual
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        Ativo
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#CEDE6C] hover:bg-[#CEDE6C]/90 text-black">
                    <Save className="mr-2 h-4 w-4" />
                    Atualizar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
