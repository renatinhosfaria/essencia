"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { Resource } from "@/lib/rbac";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
  resource: Resource;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteger rotas baseado em permissões RBAC
 *
 * @param children - Conteúdo a ser renderizado se o usuário tiver permissão
 * @param resource - Recurso que está sendo acessado
 * @param fallback - Componente a ser renderizado se não tiver permissão
 * @param redirectTo - URL para redirecionar se não tiver permissão
 */
export function ProtectedRoute({
  children,
  resource,
  fallback,
  redirectTo,
}: ProtectedRouteProps) {
  const { checkAccess } = usePermissions();
  const router = useRouter();
  const hasAccess = checkAccess(resource);

  useEffect(() => {
    if (!hasAccess && redirectTo) {
      router.replace(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (redirectTo) {
      return null; // Aguardando redirecionamento
    }

    // Tela padrão de acesso negado
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Negado</AlertTitle>
            <AlertDescription>
              Você não tem permissão para acessar este recurso. Entre em contato
              com o administrador se você acredita que isso é um erro.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

interface ProtectedActionProps {
  children: ReactNode;
  resource: Resource;
  action: "create" | "read" | "update" | "delete";
  fallback?: ReactNode;
}

/**
 * Componente para proteger ações específicas (criar, editar, deletar)
 *
 * @param children - Conteúdo a ser renderizado se o usuário tiver permissão
 * @param resource - Recurso que está sendo acessado
 * @param action - Ação que está sendo executada
 * @param fallback - Componente a ser renderizado se não tiver permissão
 */
export function ProtectedAction({
  children,
  resource,
  action,
  fallback = null,
}: ProtectedActionProps) {
  const { checkPermission } = usePermissions();
  const hasPermission = checkPermission(resource, action);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
