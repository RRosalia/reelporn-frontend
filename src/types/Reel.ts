/**
 * Reel/Video Type Definition
 * Represents a single video/reel in the platform
 */
export interface Reel {
  id: number;
  slug: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  comments: number;
  uploadedAt: string; // ISO date string
  isPremium: boolean; // Whether this video requires premium subscription

  // User/Creator information
  username: string;
  avatar: string;
  userId?: number;

  // Optional metadata
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Reel response from API (may have different field names)
 */
export interface ReelApiResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  uploaded_at: string;
  is_premium: boolean;
  username: string;
  avatar: string;
  user_id?: number;
  category?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Transform API response to Reel type
 */
export function transformReelApiResponse(data: ReelApiResponse): Reel {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    videoUrl: data.video_url,
    thumbnail: data.thumbnail,
    duration: data.duration,
    views: data.views,
    likes: data.likes,
    comments: data.comments,
    uploadedAt: data.uploaded_at,
    isPremium: data.is_premium,
    username: data.username,
    avatar: data.avatar,
    userId: data.user_id,
    category: data.category,
    tags: data.tags,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
