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
 * Pornstar Type Definition
 * Represents a pornstar in the platform
 */
export interface Pornstar {
  id: number;
  slug: string;
  name: string;
  bio: string | null;
  date_of_birth: string | null;
  date_of_birth_formatted: string | null;
  age: number | null;
  country: Country | null;
  height_cm: number | null;
  weight_kg: number | null;
  measurements: string | null;
  hair_color: string | null;
  eye_color: string | null;
  ethnicity: string | null;
  created_at: string;
  created_at_formatted: string;
  updated_at: string;
  updated_at_formatted: string;
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
