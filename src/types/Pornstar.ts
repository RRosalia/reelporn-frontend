/**
 * Country Type Definition
 */
export interface Country {
  id: number;
  name: string;
  iso: string;
  iso_alpha_3: string;
}

/**
 * Profile Image URLs for different sizes
 */
export interface ProfileImage {
  thumb: string;
  small: string;
  medium: string;
  large: string;
  original: string;
}

/**
 * Bio with language information
 */
export interface Bio {
  content: string;
  language: string;
}

/**
 * Pornstar Type Definition
 * Represents a pornstar in the platform
 */
export interface Pornstar {
  id: string; // UUID
  slug: string;
  type: 'virtual' | 'real';
  first_name: string;
  last_name: string;
  bio: Bio | null;
  profile_image: ProfileImage | null;
  date_of_birth: string | null;
  age: number | null;
  country: Country | null;
  height_cm: number | null;
  weight_kg: number | null;
  hair_color: string | null;
  eye_color: string | null;
  ethnicity: string | null;
  videos_count: number;
  images_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Pornstar Filter Parameters
 */
export interface PornstarFilters {
  name?: string;
  age?: number;
  min_age?: number;
  max_age?: number;
  country_id?: number;
  min_height?: number;
  max_height?: number;
  min_weight?: number;
  max_weight?: number;
  hair_color?: string;
  eye_color?: string;
  ethnicity?: string;
  per_page?: number;
  page?: number;
}

/**
 * Filter Options Response Types
 */
export interface FilterCountry {
  id: number;
  name: string;
  iso: string;
  pornstars_count?: number;
}

export interface HeightRange {
  min: number;
  max: number;
}

export interface WeightRange {
  min: number;
  max: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}
