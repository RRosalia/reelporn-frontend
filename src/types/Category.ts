/**
 * Category Type Definitions
 */

/**
 * Category model from the backend
 */
export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string;
  thumbnail?: string;
  video_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Category response from API
 */
export interface CategoryResponse {
  data: Category;
}

/**
 * Categories list response from API
 */
export interface CategoriesResponse {
  data: Category[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

/**
 * Category sitemap data
 */
export interface CategorySitemapData {
  slug: string;
  last_modified: string;
}

/**
 * Category sitemap response
 */
export interface CategorySitemapResponse {
  data: CategorySitemapData[];
}
