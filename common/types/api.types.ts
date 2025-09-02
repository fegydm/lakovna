// File: common/types/api.types.ts
// Last change: Updated keys to snake_case for consistency with API response conventions

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  is_success: boolean;
  data?: T;
  error?: string;
  status_message?: string;
}

// Generic paginated response
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}