export interface TenantContext {
  tenantId: string;
  tenantSlug?: string;
  tenantName?: string;
}

export interface RequestWithTenant extends Request {
  tenantId: string;
  user?: {
    sub: string;
    email: string;
    tenantId: string;
    role: string;
  };
}
