import axios from "axios";
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ValidationException,
  RateLimitException,
  ServerException,
  NetworkException,
  ApiException,
} from "./exceptions";

// Get API base URL from environment variable or default to localhost
// For server-side requests (SSR/metadata): Check if SSR_API_URL is explicitly set (for Docker/internal routing)
// For client-side requests: Always use NEXT_PUBLIC_API_URL (browser-accessible URL)
// This allows flexible configuration:
// - Dev (Docker): Set SSR_API_URL=http://host.docker.internal:9000 for server-side requests
// - Production: Either set SSR_API_URL to internal URL, or leave unset to use NEXT_PUBLIC_API_URL
const isServer = typeof window === "undefined";
const API_BASE_URL = (isServer && process.env.SSR_API_URL)
  ? process.env.SSR_API_URL // Use explicit server-side URL if set (e.g., host.docker.internal:9000)
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"); // Fallback to public URL

// Function to handle unauthorized access (401 errors)
const handleUnauthorized = () => {
  // Clear all auth data
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    // Dispatch custom event that AuthContext can listen to
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));

    // Get current path to redirect back after login
    const currentPath = window.location.pathname;

    // Don't redirect if already on login page
    if (!currentPath.includes("/login")) {
      // Redirect to login with intended location and message
      const loginUrl = `/login?redirect=${encodeURIComponent(
        currentPath
      )}&message=loginRequired`;
      window.location.href = loginUrl;
    }
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 10000, // 10 seconds
});

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") {
      // Server-side (SSR) headers - for analytics purposes
      config.headers["X-Request-Source"] = "ssr";
      config.headers["X-SSR-Request"] = "true";
    } else {
      // Client-side headers - for browser requests
      // Add auth token if available
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add visitor country header if available
      const country = getCookie("visitor_country");
      if (country) {
        config.headers["X-Visitor-Ip-Country"] = country;
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
          if (!error.config.url.includes("/login")) {
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
      throw new NetworkException("Network error - no response received");
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

export default apiClient;
