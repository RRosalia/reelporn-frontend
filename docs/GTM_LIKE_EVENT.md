# Google Tag Manager - Video Like Event

## Event Overview

The video like button triggers a GTM event called `video_like` with detailed metadata about the like action and user authentication status.

## Event Structure

### Event Name
```javascript
event: 'video_like'
```

### Data Layer Push

```javascript
window.dataLayer.push({
  event: 'video_like',
  video_id: 1,                      // Video ID (number)
  video_slug: 'hot-beach-video',    // Video slug (string)
  video_title: 'Hot Beach Day',     // Video title (string)
  video_category: 'Beach',          // Video category (string)
  is_premium: false,                // Premium flag (boolean)
  like_action: 'like',              // Action type (string)
  like_success: true,               // Success flag (boolean)
  user_authenticated: true,         // Auth status (boolean)
  user_id: 123,                     // User ID or null (number|null)
  page_url: 'https://...',          // Full page URL (string)
  timestamp: '2025-10-19T...',      // ISO timestamp (string)
});
```

## Like Actions

The `like_action` parameter indicates what the user attempted:

| Action | Description | User State |
|--------|-------------|------------|
| `like` | User liked the video | Authenticated |
| `unlike` | User unliked the video | Authenticated |
| `unauthenticated` | User attempted to like without auth | Not authenticated |

## Success Flag

The `like_success` parameter indicates the outcome:

| Value | Description |
|-------|-------------|
| `true` | Like/unlike completed successfully |
| `false` | User not authenticated OR API error occurred |

## Authentication Flow

### When User is NOT Authenticated:

1. User clicks like button
2. GTM event fires:
   ```javascript
   {
     event: 'video_like',
     like_action: 'unauthenticated',
     like_success: false,
     user_authenticated: false,
     user_id: null,
     ...
   }
   ```
3. Login dialog is shown to user
4. User can login/register to like the video

### When User IS Authenticated:

1. User clicks like button
2. UI updates optimistically (instant feedback)
3. API call is made to backend
4. GTM event fires:
   ```javascript
   {
     event: 'video_like',
     like_action: 'like', // or 'unlike'
     like_success: true,
     user_authenticated: true,
     user_id: 123,
     ...
   }
   ```

## GTM Setup

### 1. Create Data Layer Variables

Create the following Data Layer Variables in GTM:

| Variable Name | Data Layer Variable Name |
|---------------|-------------------------|
| `DLV - Video ID` | `video_id` |
| `DLV - Video Slug` | `video_slug` |
| `DLV - Video Title` | `video_title` |
| `DLV - Video Category` | `video_category` |
| `DLV - Is Premium` | `is_premium` |
| `DLV - Like Action` | `like_action` |
| `DLV - Like Success` | `like_success` |
| `DLV - User Authenticated` | `user_authenticated` |
| `DLV - User ID` | `user_id` |
| `DLV - Event Timestamp` | `timestamp` |

### 2. Create Custom Event Trigger

**Trigger Configuration:**
- Trigger Type: `Custom Event`
- Event Name: `video_like`
- This trigger fires on: `All Custom Events`

### 3. Example Tags

#### Google Analytics 4 Event
```
Tag Type: Google Analytics: GA4 Event
Event Name: video_like

Event Parameters:
- video_id: {{DLV - Video ID}}
- video_slug: {{DLV - Video Slug}}
- video_title: {{DLV - Video Title}}
- video_category: {{DLV - Video Category}}
- is_premium: {{DLV - Is Premium}}
- like_action: {{DLV - Like Action}}
- like_success: {{DLV - Like Success}}
- user_authenticated: {{DLV - User Authenticated}}
- user_id: {{DLV - User ID}}

Trigger: video_like (Custom Event)
```

#### Facebook Pixel Event
```
Tag Type: Custom HTML

<script>
  fbq('trackCustom', 'VideoLike', {
    video_id: {{DLV - Video ID}},
    video_slug: '{{DLV - Video Slug}}',
    is_premium: {{DLV - Is Premium}},
    like_action: '{{DLV - Like Action}}',
    user_authenticated: {{DLV - User Authenticated}}
  });
</script>

Trigger: video_like (Custom Event)
```

#### Conversion Tag (Authenticated Likes Only)

Create a trigger that fires ONLY for authenticated users:

**Trigger Name:** `video_like - Authenticated Only`
- Trigger Type: `Custom Event`
- Event Name: `video_like`
- This trigger fires on: `Some Custom Events`
- Fire this trigger when: `user_authenticated` equals `true`

Then create a conversion tag that uses this trigger.

## Testing

### 1. Test Unauthenticated Flow

1. Make sure you're logged out
2. Navigate to any video page
3. Click the "Like" button
4. Check browser console for:
   ```
   GTM Event Tracked: {
     event: 'video_like',
     like_action: 'unauthenticated',
     like_success: false,
     user_authenticated: false
   }
   ```
5. Verify login dialog appears

### 2. Test Authenticated Like

1. Log in to the platform
2. Navigate to any video page
3. Click the "Like" button
4. Check browser console for:
   ```
   GTM Event Tracked: {
     event: 'video_like',
     like_action: 'like',
     like_success: true,
     user_authenticated: true,
     user_id: 123
   }
   ```
5. Verify heart icon fills with red color

### 3. Test Unlike

1. While logged in and video is liked
2. Click the "Like" button again
3. Check browser console for:
   ```
   GTM Event Tracked: {
     event: 'video_like',
     like_action: 'unlike',
     like_success: true,
     user_authenticated: true
   }
   ```
4. Verify heart icon becomes outlined

### 4. Verify in GTM Preview

1. Open GTM Preview mode
2. Perform the actions above
3. Check that events fire in GTM Preview
4. Verify all data layer variables are populated correctly

## UI Features

### Optimistic Updates

The like button updates immediately when clicked (before API response):
- Heart fills with red color
- Like count increments/decrements
- If API fails, changes are reverted

### Visual Feedback

- **Heart Animation**: When liked, heart scales up briefly
- **Liked State**: Red filled heart + red border + red background tint
- **Loading State**: Opacity reduced + clicks disabled
- **Hover State**: Red border appears

### Like Count Display

The like count is shown next to the button:
- `Like (1.2K)` - Not liked yet
- `Liked (1.2K)` - Already liked

Format numbers:
- 1,234 → `1.2K`
- 1,234,567 → `1.2M`

## Sample Reports

### GA4 Custom Report - Video Likes

**Dimensions:**
- Event Name: `video_like`
- Like Action (`like_action`)
- User Authenticated (`user_authenticated`)
- Video Title (`video_title`)
- Is Premium (`is_premium`)

**Metrics:**
- Event Count
- Unique Users
- Conversion Rate (likes / total views)

### Example Queries

**Authentication Barrier Analysis:**
```sql
SELECT
  COUNT(CASE WHEN like_action = 'unauthenticated' THEN 1 END) as unauthenticated_attempts,
  COUNT(CASE WHEN like_action IN ('like', 'unlike') THEN 1 END) as authenticated_likes,
  ROUND(
    COUNT(CASE WHEN like_action = 'unauthenticated' THEN 1 END) * 100.0 /
    COUNT(*), 2
  ) as unauthenticated_rate
FROM events
WHERE event_name = 'video_like'
```

**Most Liked Videos:**
```sql
SELECT
  video_title,
  video_category,
  is_premium,
  COUNT(CASE WHEN like_action = 'like' THEN 1 END) as total_likes,
  COUNT(DISTINCT user_id) as unique_users_liked
FROM events
WHERE event_name = 'video_like' AND user_authenticated = true
GROUP BY video_title, video_category, is_premium
ORDER BY total_likes DESC
LIMIT 10
```

**Engagement by User Status:**
```sql
SELECT
  is_premium as premium_video,
  user_authenticated,
  COUNT(*) as interactions,
  COUNT(DISTINCT video_id) as unique_videos,
  COUNT(DISTINCT user_id) as unique_users
FROM events
WHERE event_name = 'video_like'
GROUP BY is_premium, user_authenticated
```

## Conversion Funnel

Track the authentication conversion funnel:

1. **Unauthenticated Like Attempt**
   - Event: `video_like`, `like_action: unauthenticated`

2. **Login Dialog Shown**
   - (Can track this as separate event if needed)

3. **User Registers/Logs In**
   - Event: `user_login` or `user_register`

4. **User Likes Video (Post-Auth)**
   - Event: `video_like`, `like_action: like`, `user_authenticated: true`

## Use Cases

### Registration Driver

Identify which videos drive the most registration attempts:
- Track `unauthenticated` like attempts
- Match with subsequent registrations
- Identify high-converting content

### Engagement Metrics

- Track like-to-view ratio
- Identify most engaging categories
- Compare premium vs free engagement

### Remarketing Audiences

Create audiences based on like behavior:
- Users who like premium content → Upsell to premium
- Users who attempt to like while logged out → Re-engagement campaign
- Highly engaged users (multiple likes) → VIP/loyalty program

### A/B Testing

Test variations of the login prompt:
- Different messaging
- Different positioning
- Different incentives

## Privacy & GDPR

The event tracks:
- ✅ Video metadata (public information)
- ✅ Like action (user interaction)
- ✅ Authentication status (boolean)
- ⚠️ User ID (only when authenticated)
- ❌ No sensitive personal information

**Recommendation:**
- User ID should only be tracked for authenticated users
- Ensure user consent for analytics tracking
- Consult with legal team about user identifier tracking

## API Integration (For Developers)

When backend is ready, update the like handler in `/src/app/[locale]/videos/[slug]/page.tsx`:

```typescript
// Replace this:
await new Promise((resolve) => setTimeout(resolve, 500));

// With actual API call:
const response = await ReelRepository.toggleLike(reel.id);
```

Expected API response:
```json
{
  "success": true,
  "is_liked": true,
  "like_count": 1234
}
```

Update the ReelRepository to add:
```typescript
async toggleLike(reelId: number): Promise<any> {
  const response = await apiClient.post(`/reels/${reelId}/like`);
  return response.data;
}
```

## Troubleshooting

### Event Not Firing

1. Check if user is authenticated (check console)
2. Verify AuthProvider is wrapping the app
3. Check for JavaScript errors in console
4. Verify GTM container is loaded

### Like Button Not Working

1. Check if ReelRepository is properly imported
2. Verify mock data has likes count
3. Check browser console for errors
4. Ensure AuthContext is available

### Wrong User ID

1. Verify user is actually logged in
2. Check localStorage for `auth_user`
3. Verify AuthContext is providing correct user
4. Check console logs for user data

## Future Enhancements

- Track time to like (how long after page load)
- Track video progress when liked (how far they watched)
- Track double-tap to like (mobile gesture)
- Track like from different sections (video player vs list)
- A/B test different like button designs

## Support

For questions or issues:
1. Check browser console for GTM events
2. Review GTM Preview mode
3. Verify user authentication status
4. Check API responses (when integrated)
