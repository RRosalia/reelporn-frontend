import axios from 'axios';
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ValidationException,
  RateLimitException,
  ServerException,
  NetworkException,
  ApiException
} from './exceptions';

// Get API base URL from environment variable or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Function to handle unauthorized access (401 errors)
const handleUnauthorized = () => {
  // Clear all auth data
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Dispatch custom event that AuthContext can listen to
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));

    // Get current path to redirect back after login
    const currentPath = window.location.pathname;

    // Don't redirect if already on login page
    if (!currentPath.includes('/login')) {
      // Redirect to login with intended location and message
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}&message=loginRequired`;
      window.location.href = loginUrl;
    }
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors and throw custom exceptions
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message;

      switch (status) {
        case 401:
          // Unauthorized - logout user and redirect for non-login requests
          if (!error.config.url.includes('/login')) {
            handleUnauthorized();
          }
          throw new UnauthorizedException(message, error.response);

        case 403:
          // Forbidden
          throw new ForbiddenException(message, error.response);

        case 404:
          // Not found
          throw new NotFoundException(message, error.response);

        case 422:
          // Validation error
          const errors = data?.errors || {};
          throw new ValidationException(message, errors, error.response);

        case 429:
          // Rate limit exceeded
          throw new RateLimitException(message, error.response);

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          throw new ServerException(message, error.response);

        default:
          // Generic API error
          throw new ApiException(message, status, error.response);
      }
    } else if (error.request) {
      // Request made but no response
      throw new NetworkException('Network error - no response received');
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

export default apiClient;
