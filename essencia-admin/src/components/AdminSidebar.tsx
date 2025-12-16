"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { Resource, ROLE_LABELS } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Home,
  Image as ImageIcon,
  LogOut,
  Megaphone,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  resource: Resource;
};

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home, resource: "dashboard" },
  {
    name: "Usuários",
    href: "/dashboard/users",
    icon: Users,
    resource: "users",
  },
  {
    name: "Alunos",
    href: "/dashboard/students",
    icon: GraduationCap,
    resource: "students",
  },
  {
    name: "Turmas",
    href: "/dashboard/classes",
    icon: BookOpen,
    resource: "classes",
  },
  {
    name: "Comunicados",
    href: "/dashboard/announcements",
    icon: Megaphone,
    resource: "announcements",
  },
  {
    name: "Galeria",
    href: "/dashboard/gallery",
    icon: ImageIcon,
    resource: "gallery",
  },
  {
    name: "Mensagens",
    href: "/dashboard/messages",
    icon: MessageCircle,
    resource: "messages",
  },
  {
    name: "Métricas",
    href: "/dashboard/metrics",
    icon: BarChart3,
    resource: "metrics",
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
    resource: "settings",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { checkAccess, userRole } = usePermissions();

  // Filtrar itens de navegação baseado nas permissões do usuário
  const allowedNavigation = useMemo(() => {
    return navigation.filter((item) => checkAccess(item.resource));
  }, [checkAccess]);

  // Obter label amigável do role
  const roleLabel = userRole ? ROLE_LABELS[userRole] : user?.role;

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      {/* Logo */}
      <div className="flex h-32 items-center justify-center border-b p-4">
        <div className="relative h-28 w-52 overflow-hidden">
          <Image
            src="/logo.png"
            alt="Essência Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {allowedNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#CEDE6C]/20 text-[#CEDE6C]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-[#F29131] text-white">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
