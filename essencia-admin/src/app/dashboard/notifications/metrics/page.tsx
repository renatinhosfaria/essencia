"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

interface NotificationMetrics {
  summary: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
    processing: number;
    successRate: number;
  };
  byPriority: Array<{
    priority: string;
    count: number;
  }>;
  avgDeliveryTimeSeconds: number;
}

const COLORS = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b"];

export default function NotificationMetricsPage() {
  const [metrics, setMetrics] = useState<NotificationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  async function loadMetrics() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await fetch(`/api/notifications/metrics?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.data);
      } else {
        toast.error("Erro ao carregar métricas");
      }
    } catch (error) {
      console.error("Failed to load metrics:", error);
      toast.error("Erro ao carregar métricas");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading || !metrics) {
    return (
      <div className="p-6">
        <p>Carregando métricas...</p>
      </div>
    );
  }

  const statusData = [
    { name: "Enviadas", value: metrics.summary.sent, color: "#10b981" },
    { name: "Falhas", value: metrics.summary.failed, color: "#ef4444" },
    { name: "Pendentes", value: metrics.summary.pending, color: "#f59e0b" },
    {
      name: "Processando",
      value: metrics.summary.processing,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Métricas de Notificações</h1>
          <p className="text-muted-foreground">
            Análise de desempenho e entrega de notificações push
          </p>
        </div>
      </div>

      {/* Filtros de Data */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm font-medium">Data Início</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="ml-2 border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Data Fim</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="ml-2 border rounded px-2 py-1"
            />
          </div>
        </div>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total de Notificações
          </div>
          <div className="text-3xl font-bold mt-2">{metrics.summary.total}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Taxa de Sucesso
          </div>
          <div className="text-3xl font-bold mt-2 text-green-600">
            {metrics.summary.successRate.toFixed(1)}%
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Enviadas
          </div>
          <div className="text-3xl font-bold mt-2 text-green-600">
            {metrics.summary.sent}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Tempo Médio de Entrega
          </div>
          <div className="text-3xl font-bold mt-2 text-blue-600">
            {metrics.avgDeliveryTimeSeconds.toFixed(1)}s
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Distribuição por Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Priority Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Distribuição por Prioridade
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.byPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detalhes */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Detalhes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {metrics.summary.pending}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Processando</p>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.summary.processing}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Falhas</p>
            <p className="text-2xl font-bold text-red-600">
              {metrics.summary.failed}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Taxa de Falha</p>
            <p className="text-2xl font-bold text-red-600">
              {metrics.summary.total > 0
                ? (
                    (metrics.summary.failed / metrics.summary.total) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
