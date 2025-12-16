import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

interface RequestWithTenant extends Request {
  tenantId?: string;
  user?: {
    tenantId?: string;
  };
}

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private _tenantId: string | null = null;

  constructor(@Inject(REQUEST) private readonly request: RequestWithTenant) {
    this._tenantId =
      request.tenantId ||
      request.user?.tenantId ||
      (request.headers['x-tenant-id'] as string) ||
      null;
  }

  get tenantId(): string {
    if (!this._tenantId) {
      throw new Error('Tenant context not set');
    }
    return this._tenantId;
  }

  setTenantId(tenantId: string): void {
    this._tenantId = tenantId;
  }

  hasTenant(): boolean {
    return this._tenantId !== null;
  }
}
