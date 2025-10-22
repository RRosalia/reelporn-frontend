/**
 * Common utility types used across the application
 */

/**
 * Type guard to check if error is an Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type for API error with optional response data
 */
export interface ApiError extends Error {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

/**
 * Type for DataLayer (Google Tag Manager)
 * GTM expects an array with push method
 */
export interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

/**
 * Extend Window interface with DataLayer
 */
declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}
