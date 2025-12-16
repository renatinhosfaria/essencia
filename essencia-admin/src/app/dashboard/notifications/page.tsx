"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NotificationSettings {
  id?: string;
  enablePushNotifications: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  quietHoursTimezone: string | null;
  maxNotificationsPerUserPerHour: number | null;
  maxNotificationsPerUserPerDay: number | null;
  enableBatching: boolean;
  batchWindowMinutes: number | null;
  enableDiaryNotifications: boolean;
  enableGalleryNotifications: boolean;
  enableMessageNotifications: boolean;
  enableAnnouncementNotifications: boolean;
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enablePushNotifications: true,
    quietHoursStart: null,
    quietHoursEnd: null,
    quietHoursTimezone: "America/Sao_Paulo",
    maxNotificationsPerUserPerHour: 10,
    maxNotificationsPerUserPerDay: 50,
    enableBatching: true,
    batchWindowMinutes: 5,
    enableDiaryNotifications: true,
    enableGalleryNotifications: true,
    enableMessageNotifications: true,
    enableAnnouncementNotifications: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch("/api/notifications/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const response = await fetch("/api/notifications/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Configurações salvas com sucesso");
      } else {
        toast.error("Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações de Notificações</h1>
          <p className="text-muted-foreground">
            Gerencie como e quando as notificações são enviadas aos usuários
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Configurações Gerais</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enablePush">Habilitar notificações push</Label>
                <p className="text-sm text-muted-foreground">
                  Ativa ou desativa todas as notificações push da escola
                </p>
              </div>
              <Switch
                id="enablePush"
                checked={settings.enablePushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enablePushNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableBatching">
                  Agrupar notificações (Batching)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Agrupa notificações similares para evitar spam
                </p>
              </div>
              <Switch
                id="enableBatching"
                checked={settings.enableBatching}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableBatching: checked })
                }
              />
            </div>

            {settings.enableBatching && (
              <div className="ml-6">
                <Label htmlFor="batchWindow">
                  Janela de agrupamento (minutos)
                </Label>
                <Input
                  id="batchWindow"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.batchWindowMinutes || 5}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      batchWindowMinutes: parseInt(e.target.value),
                    })
                  }
                  className="w-32 mt-2"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Horário de Silêncio</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Não enviar notificações durante esses horários
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quietStart">Início</Label>
              <Input
                id="quietStart"
                type="time"
                value={settings.quietHoursStart || ""}
                onChange={(e) =>
                  setSettings({ ...settings, quietHoursStart: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="quietEnd">Fim</Label>
              <Input
                id="quietEnd"
                type="time"
                value={settings.quietHoursEnd || ""}
                onChange={(e) =>
                  setSettings({ ...settings, quietHoursEnd: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Limites de Taxa</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Previne spam limitando quantas notificações um usuário pode receber
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxHour">Máximo por hora</Label>
              <Input
                id="maxHour"
                type="number"
                min="1"
                max="100"
                value={settings.maxNotificationsPerUserPerHour || 10}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxNotificationsPerUserPerHour: parseInt(e.target.value),
                  })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="maxDay">Máximo por dia</Label>
              <Input
                id="maxDay"
                type="number"
                min="1"
                max="1000"
                value={settings.maxNotificationsPerUserPerDay || 50}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxNotificationsPerUserPerDay: parseInt(e.target.value),
                  })
                }
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">
            Notificações por Funcionalidade
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ative ou desative notificações específicas
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableDiary">Diários</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar responsáveis sobre atualizações no diário
                </p>
              </div>
              <Switch
                id="enableDiary"
                checked={settings.enableDiaryNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    enableDiaryNotifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableGallery">Galeria</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar sobre novas fotos publicadas
                </p>
              </div>
              <Switch
                id="enableGallery"
                checked={settings.enableGalleryNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    enableGalleryNotifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableMessages">Mensagens</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar sobre novas mensagens recebidas
                </p>
              </div>
              <Switch
                id="enableMessages"
                checked={settings.enableMessageNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    enableMessageNotifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAnnouncements">Comunicados</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar sobre novos comunicados da escola
                </p>
              </div>
              <Switch
                id="enableAnnouncements"
                checked={settings.enableAnnouncementNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    enableAnnouncementNotifications: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="outline" onClick={loadSettings} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
