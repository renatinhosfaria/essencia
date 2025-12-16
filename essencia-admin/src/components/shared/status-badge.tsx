import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "sent"
  | "draft"
  | "published"
  | "archived"
  | "success"
  | "error"
  | "warning"
  | "info";

interface StatusBadgeProps {
  status: string | StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "Ativo",
    className: "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200",
  },
  inactive: {
    label: "Inativo",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-gray-200",
  },
  pending: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-yellow-200",
  },
  sent: {
    label: "Enviado",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200",
  },
  draft: {
    label: "Rascunho",
    className: "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200",
  },
  published: {
    label: "Publicado",
    className: "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200",
  },
  archived: {
    label: "Arquivado",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-gray-200",
  },
  success: {
    label: "Sucesso",
    className: "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200",
  },
  error: {
    label: "Erro",
    className: "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200",
  },
  warning: {
    label: "Atenção",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-orange-200",
  },
  info: {
    label: "Info",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || {
    label: status,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", config.className, className)}
    >
      {label || config.label}
    </Badge>
  );
}
