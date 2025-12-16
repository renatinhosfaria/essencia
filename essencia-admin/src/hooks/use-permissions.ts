"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Action,
  canAccess,
  getPermissionScope,
  hasPermission,
  Resource,
  Role,
} from "@/lib/rbac";
import { useMemo } from "react";

/**
 * Hook para verificar permissões do usuário autenticado
 */
export function usePermissions() {
  const { user } = useAuth();

  const userRole = user?.role as Role | undefined;

  /**
   * Verifica se o usuário tem permissão para uma ação específica em um recurso
   */
  const checkPermission = useMemo(
    () =>
      (resource: Resource, action: Action): boolean => {
        if (!userRole) return false;
        return hasPermission(userRole, resource, action);
      },
    [userRole]
  );

  /**
   * Verifica se o usuário tem acesso a um recurso (qualquer ação)
   */
  const checkAccess = useMemo(
    () =>
      (resource: Resource): boolean => {
        if (!userRole) return false;
        return canAccess(userRole, resource);
      },
    [userRole]
  );

  /**
   * Obtém o escopo de acesso do usuário para um recurso
   */
  const getScope = useMemo(
    () =>
      (resource: Resource): "all" | "assigned" | "own" | null => {
        if (!userRole) return null;
        return getPermissionScope(userRole, resource);
      },
    [userRole]
  );

  /**
   * Verifica se o usuário pode criar em um recurso
   */
  const canCreate = useMemo(
    () =>
      (resource: Resource): boolean => {
        return checkPermission(resource, "create");
      },
    [checkPermission]
  );

  /**
   * Verifica se o usuário pode ler em um recurso
   */
  const canRead = useMemo(
    () =>
      (resource: Resource): boolean => {
        return checkPermission(resource, "read");
      },
    [checkPermission]
  );

  /**
   * Verifica se o usuário pode atualizar em um recurso
   */
  const canUpdate = useMemo(
    () =>
      (resource: Resource): boolean => {
        return checkPermission(resource, "update");
      },
    [checkPermission]
  );

  /**
   * Verifica se o usuário pode deletar em um recurso
   */
  const canDelete = useMemo(
    () =>
      (resource: Resource): boolean => {
        return checkPermission(resource, "delete");
      },
    [checkPermission]
  );

  /**
   * Verifica se o usuário é admin
   */
  const isAdmin = useMemo(() => userRole === "admin", [userRole]);

  /**
   * Verifica se o usuário é secretaria
   */
  const isSecretary = useMemo(() => userRole === "secretary", [userRole]);

  /**
   * Verifica se o usuário é professor
   */
  const isTeacher = useMemo(() => userRole === "teacher", [userRole]);

  /**
   * Verifica se o usuário é responsável
   */
  const isGuardian = useMemo(() => userRole === "guardian", [userRole]);

  /**
   * Verifica se o usuário é funcionário
   */
  const isStaff = useMemo(() => userRole === "staff", [userRole]);

  return {
    userRole,
    checkPermission,
    checkAccess,
    getScope,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    isAdmin,
    isSecretary,
    isTeacher,
    isGuardian,
    isStaff,
  };
}
