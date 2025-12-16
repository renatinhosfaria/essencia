/**
 * RBAC Configuration
 * Define permissões de acesso para cada role/perfil
 */

export type Role = "admin" | "secretary" | "teacher" | "guardian" | "staff";

export type Resource =
  | "dashboard"
  | "users"
  | "students"
  | "classes"
  | "announcements"
  | "gallery"
  | "messages"
  | "metrics"
  | "settings"
  | "notifications";

export type Action = "create" | "read" | "update" | "delete";

export type Permission = {
  resource: Resource;
  actions: Action[];
  scope?: "all" | "assigned" | "own"; // all = todos, assigned = atribuídos, own = próprios
};

/**
 * Matriz de permissões por role
 * Baseado no PRD e documentação do projeto
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  // Admin: acesso total a tudo
  admin: [
    { resource: "dashboard", actions: ["read"] },
    {
      resource: "users",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "students",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "classes",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "announcements",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "gallery",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "messages",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "metrics",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "settings",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "notifications",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
  ],

  // Secretary: similar ao admin, mas sem algumas configurações críticas
  secretary: [
    { resource: "dashboard", actions: ["read"] },
    {
      resource: "users",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "students",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "classes",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "announcements",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "gallery",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    {
      resource: "messages",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
    { resource: "metrics", actions: ["read"], scope: "all" },
    { resource: "settings", actions: ["read"], scope: "all" },
    {
      resource: "notifications",
      actions: ["create", "read", "update", "delete"],
      scope: "all",
    },
  ],

  // Teacher: acesso limitado às turmas atribuídas
  teacher: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "students", actions: ["read"], scope: "assigned" },
    { resource: "classes", actions: ["read"], scope: "assigned" },
    { resource: "announcements", actions: ["read"], scope: "all" },
    { resource: "gallery", actions: ["read"], scope: "all" },
    {
      resource: "messages",
      actions: ["create", "read", "update"],
      scope: "assigned",
    },
    { resource: "metrics", actions: ["read"], scope: "assigned" },
    { resource: "notifications", actions: ["read"], scope: "own" },
  ],

  // Guardian: acesso apenas aos próprios filhos
  guardian: [
    { resource: "dashboard", actions: ["read"] },
    { resource: "students", actions: ["read"], scope: "own" },
    { resource: "classes", actions: ["read"], scope: "own" },
    { resource: "announcements", actions: ["read"], scope: "all" },
    { resource: "gallery", actions: ["read"], scope: "all" },
    { resource: "messages", actions: ["create", "read"], scope: "own" },
    { resource: "notifications", actions: ["read"], scope: "own" },
  ],

  // Staff: acesso limitado para funções administrativas básicas
  staff: [
    { resource: "dashboard", actions: ["read"] },
    {
      resource: "students",
      actions: ["create", "read", "update"],
      scope: "all",
    },
    { resource: "classes", actions: ["read"], scope: "all" },
    { resource: "announcements", actions: ["read"], scope: "all" },
    { resource: "gallery", actions: ["read"], scope: "all" },
    { resource: "notifications", actions: ["read"], scope: "own" },
  ],
};

/**
 * Verifica se um role tem permissão para um recurso e ação específicos
 */
export function hasPermission(
  role: Role,
  resource: Resource,
  action: Action
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  const resourcePermission = permissions.find((p) => p.resource === resource);
  if (!resourcePermission) return false;

  return resourcePermission.actions.includes(action);
}

/**
 * Verifica se um role tem acesso a um recurso (qualquer ação)
 */
export function canAccess(role: Role, resource: Resource): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.some((p) => p.resource === resource);
}

/**
 * Obtém o escopo de acesso para um recurso
 */
export function getPermissionScope(
  role: Role,
  resource: Resource
): "all" | "assigned" | "own" | null {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return null;

  const resourcePermission = permissions.find((p) => p.resource === resource);
  return resourcePermission?.scope || null;
}

/**
 * Labels amigáveis para os roles
 */
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  secretary: "Secretaria",
  teacher: "Professor",
  guardian: "Responsável",
  staff: "Funcionário",
};
