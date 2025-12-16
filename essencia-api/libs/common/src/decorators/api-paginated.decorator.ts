import { applyDecorators, Type } from '@nestjs/common';

export interface PaginatedOptions {
  description?: string;
  type: Type<unknown>;
}

/**
 * Decorator for paginated API responses
 * Can be extended with Swagger decorators when @nestjs/swagger is added
 */
export function ApiPaginated(options: PaginatedOptions) {
  return applyDecorators();
  // Add Swagger decorators here when needed
  // @ApiOkResponse({ type: PaginatedResponse(options.type) })
}
