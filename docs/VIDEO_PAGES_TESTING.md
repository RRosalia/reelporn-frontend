# Video Landing Pages - Testing Guide

This guide explains how to test the video landing pages with different variations (regular, premium, 404).

## Quick Start

1. **Navigate to the Videos Test Page:**
   ```
   http://localhost:3000/videos
   or
   http://localhost:3000/en/videos
   ```

2. **You'll see a grid of test videos with different scenarios**

## Available Test Videos

### Regular (Free) Videos

These videos are accessible to all users and include standard VideoObject structured data:

- **Hot Beach Day** - `/videos/hot-beach-video`
  - Regular video with 125K views
  - Duration: 9m 56s
  - Category: Beach

- **Sunset Paradise** - `/videos/sunset-paradise`
  - Short 15-second reel
  - 89K views
  - Category: Nature

- **Intense Workout Session** - `/videos/workout-motivation`
  - Popular video with 234K views
  - Category: Fitness

- **Learn This Amazing Dance** - `/videos/dance-tutorial`
  - Viral video with 456K views
  - Category: Dance

### Premium Videos

These videos include both VideoObject AND Paywalled Content structured data:

- **VIP Exclusive Experience** - `/videos/exclusive-vip-content`
  - Premium exclusive content
  - 45K views, 12K likes
  - Shows gold premium badge
  - Duration: 10m 53s

- **Premium Yoga Masterclass** - `/videos/premium-yoga-class`
  - Advanced content with detailed instructions
  - 56K views
  - Category: Wellness

### 404 Not Found Test

- **Non-existent Video** - `/videos/non-existent-video`
  - Any slug that doesn't exist in mock data
  - Triggers custom 404 page
  - Shows "Video Not Found or Deleted" message

## Testing Instructions

### 1. Test Regular Videos

1. Click on any video without a premium badge
2. Verify:
   - ✅ Video player loads correctly
   - ✅ Video metadata displays (title, description, stats)
   - ✅ Creator information shows
   - ✅ No premium badge visible
   - ✅ View page source and find VideoObject structured data

### 2. Test Premium Videos

1. Click on any video with the gold "Premium" badge
2. Verify:
   - ✅ Premium badge shows in top-right corner of video player
   - ✅ All standard features work
   - ✅ View page source and find BOTH:
     - VideoObject structured data
     - Paywalled Content structured data (isAccessibleForFree: "False")

### 3. Test 404 Error Page

1. Click the "404 TEST" card OR navigate to any non-existent slug
2. Verify:
   - ✅ Custom 404 page displays
   - ✅ Error message is clear
   - ✅ "Go Back" button works
   - ✅ "Go to Homepage" button works
   - ✅ Suggestions are helpful
   - ✅ HTTP status code is 404 (check Network tab)

### 4. Test SEO Structured Data

#### For Regular Videos:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Hot Beach Day",
  "description": "...",
  "thumbnailUrl": ["..."],
  "uploadDate": "2025-10-15T10:30:00Z",
  "duration": "PT9M56S",
  "contentUrl": "...",
  "embedUrl": "...",
  "interactionStatistic": [...]
}
</script>
```

#### For Premium Videos (includes both):
```html
<!-- VideoObject -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  ...
}
</script>

<!-- Paywalled Content -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "hasPart": {
    "@type": "WebPageElement",
    "isAccessibleForFree": "False",
    "cssSelector": ".video-player"
  }
}
</script>
```

## Mock Data Configuration

The mock data is currently **ENABLED** by default. To switch to real API:

1. Open `src/lib/repositories/ReelRepository.ts`
2. Change `private useMockData = true;` to `private useMockData = false;`

## Adding More Test Videos

To add more test videos, edit `src/lib/mocks/videoMockData.ts`:

```typescript
export const mockVideos: Record<string, ReelApiResponse> = {
  'your-video-slug': {
    id: 7,
    slug: 'your-video-slug',
    title: 'Your Video Title',
    description: 'Your description',
    video_url: 'https://example.com/video.mp4',
    thumbnail: 'https://picsum.photos/seed/yourslug/1920/1080',
    duration: 60,
    views: 10000,
    likes: 500,
    comments: 50,
    uploaded_at: '2025-10-19T12:00:00Z',
    is_premium: false, // Set to true for premium
    username: 'YourUsername',
    avatar: 'https://i.pravatar.cc/150?img=1',
    user_id: 107,
    category: 'Category',
    tags: ['tag1', 'tag2'],
    created_at: '2025-10-19T12:00:00Z',
    updated_at: '2025-10-19T12:00:00Z',
  },
};
```

## Internationalization

All pages support 4 languages:
- English (en)
- Dutch (nl)
- German (de)
- French (fr)

Test by changing the locale in the URL:
- `/en/videos/hot-beach-video`
- `/nl/videos/hot-beach-video`
- `/de/videos/hot-beach-video`
- `/fr/videos/hot-beach-video`

## Browser Testing

Recommended browsers for testing:
- ✅ Chrome/Edge (best for DevTools)
- ✅ Firefox (good for SEO testing)
- ✅ Safari (test on macOS/iOS)

## SEO Validation Tools

Test structured data with these tools:

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Paste the full URL of a video page

2. **Schema Markup Validator**
   - https://validator.schema.org/
   - View page source, copy the JSON-LD, and validate

3. **Google Search Console**
   - Use URL Inspection tool once deployed

## Troubleshooting

### Video doesn't load
- Check console for errors
- Verify mock data slug matches URL
- Check if `useMockData` is true in ReelRepository

### 404 page doesn't show
- Ensure the slug doesn't exist in mockVideos
- Check browser console for errors
- Verify notFound() is being called

### Structured data missing
- View page source (not inspector)
- Search for "application/ld+json"
- Verify reel data is loaded before rendering

## Production Checklist

Before deploying to production:

- [ ] Set `useMockData = false` in ReelRepository
- [ ] Verify real API endpoint `/reels/slug/{slug}` works
- [ ] Test with real video data
- [ ] Validate all structured data
- [ ] Test all 4 languages
- [ ] Test 404 handling with real missing videos
- [ ] Check mobile responsiveness
- [ ] Verify video player controls work
- [ ] Test premium badge display logic
- [ ] Confirm SEO meta tags are correct

## Notes

- Mock data includes realistic view counts, likes, and comments
- Video thumbnails use placeholder images (picsum.photos)
- Video files use Google's sample videos for testing
- Network delay is simulated (500ms) to test loading states
- All dates are in ISO 8601 format for proper SEO
