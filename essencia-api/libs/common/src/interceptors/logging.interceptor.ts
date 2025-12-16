import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('user-agent') || '';
    const tenantId =
      request.tenantId || request.user?.tenantId || request.headers['x-tenant-id'] || 'no-tenant';

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const contentLength = response.get('content-length');

          this.logger.log(
            `${method} ${url} ${statusCode} ${contentLength || '-'} - ${Date.now() - now}ms [tenant: ${tenantId}]`,
          );
        },
        error: (error) => {
          this.logger.error(
            `${method} ${url} - ${Date.now() - now}ms [tenant: ${tenantId}] - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
