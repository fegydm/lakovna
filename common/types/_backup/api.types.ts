// File: common/types/api.types.ts
// Last change: Updated keys to camelCase for consistency with API response conventions

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  data?: T;
  error?: string;
  statusMessage?: string;
}

// Generic paginated response
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}