import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    // Get tenant from request (set by guard), header or user token
    const tenantIdFromRequest = request.tenantId;
    const tenantIdFromHeader = request.headers['x-tenant-id'];
    const tenantIdFromUser = request.user?.tenantId;

    const tenantId = tenantIdFromRequest || tenantIdFromHeader || tenantIdFromUser;

    // Allow some auth routes that don't yet have tenant context (e.g. login/refresh)
    const rawPath: string = (request.originalUrl || request.url || '').split('?')[0] || '';
    const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

    const isAllowlistedRoute =
      /^\/(api\/v1\/)?health(\/|$)/.test(path) ||
      /^\/(api\/v1\/)?auth\/(login|refresh|register|forgot-password|reset-password)(\/|$)/.test(
        path,
      ) ||
      /^\/(api\/v1\/)?tenants\/by-slug\/[^/]+(\/|$)/.test(path);

    if (!tenantId && !isAllowlistedRoute) {
      throw new BadRequestException('Tenant ID is required');
    }

    // Attach tenant to request for use in services
    request.tenantId = tenantId;

    return next.handle();
  }
}
