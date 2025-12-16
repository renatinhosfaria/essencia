"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Eye,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import CountUp from "react-countup";

// Mock data para demonstração
const weeklyStats = [
  { day: "Seg", diaries: 95, messages: 23, announcements: 2 },
  { day: "Ter", diaries: 92, messages: 31, announcements: 1 },
  { day: "Qua", diaries: 98, messages: 28, announcements: 0 },
  { day: "Qui", diaries: 89, messages: 45, announcements: 3 },
  { day: "Sex", diaries: 94, messages: 19, announcements: 1 },
];

const topEngagedUsers = [
  { name: "Marina Lima", interactions: 45, type: "guardian" },
  { name: "João Santos", interactions: 38, type: "guardian" },
  { name: "Maria Costa", interactions: 32, type: "guardian" },
  { name: "Carlos Ferreira", interactions: 28, type: "guardian" },
  { name: "Ana Paula", interactions: 25, type: "guardian" },
];

const metrics = [
  {
    title: "Taxa de Visualização",
    value: 89,
    suffix: "%",
    change: "+5%",
    description: "Comunicados visualizados",
    icon: Eye,
    color: "#CEDE6C",
  },
  {
    title: "Diários Preenchidos",
    value: 95,
    suffix: "%",
    change: "+2%",
    description: "Preenchimento diário",
    icon: BookOpen,
    color: "#F29131",
  },
  {
    title: "Tempo de Resposta",
    value: 12,
    suffix: "min",
    change: "-3min",
    description: "Média de resposta",
    icon: MessageCircle,
    color: "#3B82F6",
  },
  {
    title: "Responsáveis Ativos",
    value: 127,
    suffix: "",
    change: "+8",
    description: "Este mês",
    icon: Users,
    color: "#22C55E",
  },
];

export default function MetricsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <ProtectedRoute resource="metrics">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold">Métricas de Engajamento</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho e uso do sistema
          </p>
        </motion.div>

        {/* Main Metrics */}
        <motion.div
          variants={item}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.title}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div
                    className="p-2 rounded-lg bg-opacity-10"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <metric.icon
                      className="h-5 w-5"
                      style={{ color: metric.color }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    <CountUp
                      end={metric.value}
                      duration={2}
                      suffix={metric.suffix}
                    />
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 font-medium">
                      {metric.change}
                    </span>{" "}
                    - {metric.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Activity Chart */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Atividade Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyStats.map((day, index) => (
                    <motion.div
                      key={day.day}
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{day.day}</span>
                        <span className="text-muted-foreground">
                          {day.diaries}% diários | {day.messages} msgs
                        </span>
                      </div>
                      <div className="flex gap-1 h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#CEDE6C]"
                          initial={{ width: 0 }}
                          animate={{ width: `${day.diaries}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Engaged Users */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Responsáveis Mais Engajados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEngagedUsers.map((user, index) => (
                    <motion.div
                      key={user.name}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-sm shadow-sm"
                          style={{
                            backgroundColor:
                              index === 0
                                ? "#CEDE6C"
                                : index === 1
                                ? "#F29131"
                                : "#9FA1A4",
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">
                        {user.interactions} interações
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#CEDE6C]" />
                Diários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Preenchidos hoje</span>
                <span className="font-bold">
                  <CountUp end={47} duration={2} />
                  /50
                </span>
              </div>
              <div className="flex justify-between">
                <span>Média semanal</span>
                <span className="font-bold">
                  <CountUp end={94} duration={2} suffix="%" />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tempo médio</span>
                <span className="font-bold">3min</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#F29131]" />
                Mensagens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Enviadas hoje</span>
                <span className="font-bold">
                  <CountUp end={43} duration={2} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de leitura</span>
                <span className="font-bold">
                  <CountUp end={78} duration={2} suffix="%" />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tempo resposta</span>
                <span className="font-bold">12min</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#3B82F6]" />
                Comunicados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Enviados este mês</span>
                <span className="font-bold">
                  <CountUp end={12} duration={2} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de abertura</span>
                <span className="font-bold">
                  <CountUp end={89} duration={2} suffix="%" />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Alcance médio</span>
                <span className="font-bold">
                  <CountUp end={95} duration={2} suffix="%" />
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
}
