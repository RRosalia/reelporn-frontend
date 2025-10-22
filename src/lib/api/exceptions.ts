/**
 * API error response structure from Laravel
 */
export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  data?: {
    reason?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class ApiException extends Error {
  public status: number;
  public response: ApiErrorResponse | null;

  constructor(message: string, status: number, response: ApiErrorResponse | null = null) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.response = response;
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string = 'Unauthorized', response: ApiErrorResponse | null = null) {
    super(message, 401, response);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string = 'Forbidden', response: ApiErrorResponse | null = null) {
    super(message, 403, response);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends ApiException {
  constructor(message: string = 'Not Found', response: ApiErrorResponse | null = null) {
    super(message, 404, response);
    this.name = 'NotFoundException';
  }
}

export class ValidationException extends ApiException {
  public errors: Record<string, string[]>;

  constructor(
    message: string = 'Validation Error',
    errors: Record<string, string[]> = {},
    response: ApiErrorResponse | null = null
  ) {
    super(message, 422, response);
    this.name = 'ValidationException';
    this.errors = errors;
  }
}

export class RateLimitException extends ApiException {
  constructor(message: string = 'Too Many Requests', response: ApiErrorResponse | null = null) {
    super(message, 429, response);
    this.name = 'RateLimitException';
  }
}

export class ServerException extends ApiException {
  constructor(message: string = 'Internal Server Error', response: ApiErrorResponse | null = null) {
    super(message, 500, response);
    this.name = 'ServerException';
  }
}

export class NetworkException extends Error {
  constructor(message: string = 'Network Error') {
    super(message);
    this.name = 'NetworkException';
  }
}
