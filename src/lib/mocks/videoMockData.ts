import { ReelApiResponse } from '@/types/Reel';

/**
 * Mock video data for testing
 * This simulates the API responses for different video scenarios
 */

export const mockVideos: Record<string, ReelApiResponse> = {
  'hot-beach-video': {
    id: 1,
    slug: 'hot-beach-video',
    title: 'Hot Beach Day',
    description: 'Amazing beach content with stunning views and great vibes. This is a regular free video that everyone can watch.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://picsum.photos/seed/beach1/1920/1080',
    duration: 596, // 9 minutes 56 seconds
    views: 125000,
    likes: 8500,
    comments: 342,
    uploaded_at: '2025-10-15T10:30:00Z',
    is_premium: false,
    username: 'BeachBabe',
    avatar: 'https://i.pravatar.cc/150?img=5',
    user_id: 101,
    category: 'Beach',
    tags: ['beach', 'outdoor', 'summer'],
    created_at: '2025-10-15T10:30:00Z',
    updated_at: '2025-10-15T10:30:00Z',
  },
  'exclusive-vip-content': {
    id: 2,
    slug: 'exclusive-vip-content',
    title: 'VIP Exclusive Experience',
    description: 'Premium exclusive content only for VIP members. Unlock this amazing experience with a premium subscription.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://picsum.photos/seed/vip1/1920/1080',
    duration: 653, // 10 minutes 53 seconds
    views: 45000,
    likes: 12000,
    comments: 890,
    uploaded_at: '2025-10-18T14:20:00Z',
    is_premium: true,
    username: 'VIPCreator',
    avatar: 'https://i.pravatar.cc/150?img=12',
    user_id: 102,
    category: 'VIP',
    tags: ['premium', 'exclusive', 'vip'],
    created_at: '2025-10-18T14:20:00Z',
    updated_at: '2025-10-18T14:20:00Z',
  },
  'sunset-paradise': {
    id: 3,
    slug: 'sunset-paradise',
    title: 'Sunset Paradise',
    description: 'Beautiful sunset with amazing colors and perfect atmosphere. A romantic and relaxing experience.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://picsum.photos/seed/sunset1/1920/1080',
    duration: 15, // 15 seconds
    views: 89000,
    likes: 5600,
    comments: 234,
    uploaded_at: '2025-10-10T18:45:00Z',
    is_premium: false,
    username: 'SunsetLover',
    avatar: 'https://i.pravatar.cc/150?img=20',
    user_id: 103,
    category: 'Nature',
    tags: ['sunset', 'romantic', 'nature'],
    created_at: '2025-10-10T18:45:00Z',
    updated_at: '2025-10-10T18:45:00Z',
  },
  'workout-motivation': {
    id: 4,
    slug: 'workout-motivation',
    title: 'Intense Workout Session',
    description: 'Get motivated with this intense workout session. Perfect form and amazing energy!',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://picsum.photos/seed/workout1/1920/1080',
    duration: 15, // 15 seconds
    views: 234000,
    likes: 18000,
    comments: 1200,
    uploaded_at: '2025-10-05T09:15:00Z',
    is_premium: false,
    username: 'FitnessPro',
    avatar: 'https://i.pravatar.cc/150?img=33',
    user_id: 104,
    category: 'Fitness',
    tags: ['workout', 'fitness', 'motivation'],
    created_at: '2025-10-05T09:15:00Z',
    updated_at: '2025-10-05T09:15:00Z',
  },
  'premium-yoga-class': {
    id: 5,
    slug: 'premium-yoga-class',
    title: 'Premium Yoga Masterclass',
    description: 'Advanced yoga techniques and poses. This premium content includes detailed instructions and professional guidance.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://picsum.photos/seed/yoga1/1920/1080',
    duration: 60, // 1 minute
    views: 56000,
    likes: 9800,
    comments: 567,
    uploaded_at: '2025-10-12T07:00:00Z',
    is_premium: true,
    username: 'YogaMaster',
    avatar: 'https://i.pravatar.cc/150?img=44',
    user_id: 105,
    category: 'Wellness',
    tags: ['yoga', 'premium', 'wellness', 'masterclass'],
    created_at: '2025-10-12T07:00:00Z',
    updated_at: '2025-10-12T07:00:00Z',
  },
  'dance-tutorial': {
    id: 6,
    slug: 'dance-tutorial',
    title: 'Learn This Amazing Dance',
    description: 'Step-by-step dance tutorial. Follow along and learn this trending dance move!',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://picsum.photos/seed/dance1/1920/1080',
    duration: 15, // 15 seconds
    views: 456000,
    likes: 34000,
    comments: 2300,
    uploaded_at: '2025-10-01T16:30:00Z',
    is_premium: false,
    username: 'DanceQueen',
    avatar: 'https://i.pravatar.cc/150?img=25',
    user_id: 106,
    category: 'Dance',
    tags: ['dance', 'tutorial', 'trending'],
    created_at: '2025-10-01T16:30:00Z',
    updated_at: '2025-10-01T16:30:00Z',
  },
};

/**
 * Get a mock video by slug
 * Returns null if not found (simulates 404)
 */
export function getMockVideoBySlug(slug: string): ReelApiResponse | null {
  return mockVideos[slug] || null;
}

/**
 * Get all mock video slugs
 */
export function getAllMockVideoSlugs(): string[] {
  return Object.keys(mockVideos);
}
