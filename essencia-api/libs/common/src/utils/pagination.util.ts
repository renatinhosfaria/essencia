import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '../dto/pagination.dto';

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  query: PaginationQueryDto,
): PaginatedResponseDto<T> {
  const page = query.page || 1;
  const limit = query.limit || 20;
  return new PaginatedResponseDto(data, total, page, limit);
}

export function getPaginationOffset(query: PaginationQueryDto): {
  offset: number;
  limit: number;
} {
  const page = query.page || 1;
  const limit = query.limit || 20;
  return {
    offset: (page - 1) * limit,
    limit,
  };
}
