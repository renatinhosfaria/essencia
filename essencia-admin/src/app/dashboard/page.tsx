"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    BookOpen,
    GraduationCap,
    MessageCircle,
    TrendingUp,
    Users,
} from "lucide-react";
import CountUp from "react-countup";

// Mock data para demonstração
const stats = [
  {
    title: "Total de Alunos",
    value: "127",
    change: "+5",
    icon: GraduationCap,
    color: "#CEDE6C",
  },
  {
    title: "Professores",
    value: "12",
    change: "+2",
    icon: Users,
    color: "#F29131",
  },
  {
    title: "Turmas Ativas",
    value: "8",
    change: "0",
    icon: BookOpen,
    color: "#3B82F6",
  },
  {
    title: "Mensagens Hoje",
    value: "43",
    change: "+12",
    icon: MessageCircle,
    color: "#22C55E",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "diary",
    message: "Prof. Carla preencheu o diário do 3º Ano",
    time: "2 min atrás",
  },
  {
    id: 2,
    type: "message",
    message: "Marina Silva enviou uma mensagem",
    time: "15 min atrás",
  },
  {
    id: 3,
    type: "user",
    message: "Novo responsável cadastrado: João Santos",
    time: "1h atrás",
  },
  {
    id: 4,
    type: "announcement",
    message: "Comunicado enviado: Reunião de Pais",
    time: "2h atrás",
  },
  {
    id: 5,
    type: "gallery",
    message: "5 fotos adicionadas ao Mural",
    time: "3h atrás",
  },
];

const engagementData = [
  { name: "Responsáveis Ativos", value: 89, total: 100, color: "#CEDE6C" },
  { name: "Diários Preenchidos", value: 95, total: 100, color: "#F29131" },
  { name: "Mensagens Lidas", value: 78, total: 100, color: "#3B82F6" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          {getGreeting()}, <span className="font-semibold text-primary">{user?.name?.split(" ")[0] || "Admin"}</span>! 
          Aqui está o resumo do dia.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div 
                  className="p-2 rounded-lg bg-opacity-10"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <CountUp end={parseInt(stat.value)} duration={2} separator="." />
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">{stat.change}</span> este mês
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-2 w-2 mt-2 rounded-full bg-[#CEDE6C]" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Métricas de Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {engagementData.map((metric, index) => (
                  <motion.div 
                    key={metric.name} 
                    className="space-y-2"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>{metric.name}</span>
                      <span className="font-medium">
                        <CountUp end={metric.value} duration={2} suffix="%" />
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        style={{
                          backgroundColor: metric.color,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                title="Novo Aluno"
                description="Cadastrar novo aluno"
                icon={GraduationCap}
                href="/dashboard/students?new=true"
                color="#CEDE6C"
              />
              <QuickActionCard
                title="Novo Comunicado"
                description="Enviar comunicado"
                icon={MessageCircle}
                href="/dashboard/announcements?new=true"
                color="#F29131"
              />
              <QuickActionCard
                title="Nova Turma"
                description="Criar nova turma"
                icon={BookOpen}
                href="/dashboard/classes?new=true"
                color="#3B82F6"
              />
              <QuickActionCard
                title="Novo Usuário"
                description="Cadastrar usuário"
                icon={Users}
                href="/dashboard/users?new=true"
                color="#22C55E"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}
