# Google Tag Manager - Video Share Event

## Event Overview

The video share button triggers a GTM event called `video_share` with detailed metadata about the share action.

## Event Structure

### Event Name
```javascript
event: 'video_share'
```

### Data Layer Push

```javascript
window.dataLayer.push({
  event: 'video_share',
  video_id: 1,                      // Video ID (number)
  video_slug: 'hot-beach-video',    // Video slug (string)
  video_title: 'Hot Beach Day',     // Video title (string)
  video_category: 'Beach',          // Video category (string)
  is_premium: false,                // Premium flag (boolean)
  share_method: 'native_share',     // Share method (string)
  share_success: true,              // Success flag (boolean)
  page_url: 'https://...',          // Full page URL (string)
  timestamp: '2025-10-19T...',      // ISO timestamp (string)
});
```

## Share Methods

The `share_method` parameter indicates how the user shared the video:

| Method | Description | Platform |
|--------|-------------|----------|
| `native_share` | Native Web Share API used | Mobile/Modern Browsers |
| `clipboard` | Modern clipboard API used | Desktop/Browsers without Web Share |
| `clipboard_legacy` | Legacy execCommand used | Older browsers |

## Success Flag

The `share_success` parameter indicates the outcome:

| Value | Description |
|-------|-------------|
| `true` | Share completed successfully |
| `false` | User cancelled native share dialog |

**Note:** Clipboard copy failures automatically fall back to legacy method, so they will still report `success: true` if the fallback works.

## GTM Setup

### 1. Enable Built-in Variables

In GTM, enable these built-in variables:
- Page URL
- Page Path
- Referrer

### 2. Create Data Layer Variables

Create the following Data Layer Variables in GTM:

| Variable Name | Data Layer Variable Name |
|---------------|-------------------------|
| `DLV - Video ID` | `video_id` |
| `DLV - Video Slug` | `video_slug` |
| `DLV - Video Title` | `video_title` |
| `DLV - Video Category` | `video_category` |
| `DLV - Is Premium` | `is_premium` |
| `DLV - Share Method` | `share_method` |
| `DLV - Share Success` | `share_success` |
| `DLV - Event Timestamp` | `timestamp` |

### 3. Create Custom Event Trigger

**Trigger Configuration:**
- Trigger Type: `Custom Event`
- Event Name: `video_share`
- This trigger fires on: `All Custom Events`

### 4. Example Tags

#### Google Analytics 4 Event
```
Tag Type: Google Analytics: GA4 Event
Event Name: video_share

Event Parameters:
- video_id: {{DLV - Video ID}}
- video_slug: {{DLV - Video Slug}}
- video_title: {{DLV - Video Title}}
- video_category: {{DLV - Video Category}}
- is_premium: {{DLV - Is Premium}}
- share_method: {{DLV - Share Method}}
- share_success: {{DLV - Share Success}}

Trigger: video_share (Custom Event)
```

#### Facebook Pixel Event
```
Tag Type: Custom HTML

<script>
  fbq('trackCustom', 'VideoShare', {
    video_id: {{DLV - Video ID}},
    video_slug: '{{DLV - Video Slug}}',
    is_premium: {{DLV - Is Premium}},
    share_method: '{{DLV - Share Method}}',
    share_success: {{DLV - Share Success}}
  });
</script>

Trigger: video_share (Custom Event)
```

## Testing

### 1. Enable GTM Preview Mode

1. Go to GTM workspace
2. Click "Preview" button
3. Enter your website URL
4. Click "Connect"

### 2. Test Share Button

1. Navigate to any video page (e.g., `/videos/hot-beach-video`)
2. Click the "Share" button
3. Complete the share action (or cancel on mobile)

### 3. Verify in GTM Preview

Check the "Summary" tab in GTM Preview:
- Event `video_share` should appear
- All data layer variables should be populated
- Check "Variables" tab to see values

### 4. Verify in Browser Console

Open browser console and look for:
```
GTM Event Tracked: {
  event: 'video_share',
  video_id: 1,
  video_slug: 'hot-beach-video',
  share_method: 'clipboard',
  share_success: true
}
```

### 5. Test Different Scenarios

**Mobile (iOS/Android):**
- Click Share → Opens native share sheet
- Complete share → `native_share`, `success: true`
- Cancel share → `native_share`, `success: false`

**Desktop:**
- Click Share → Copies to clipboard
- Check → `clipboard`, `success: true`

**Older Browsers:**
- Click Share → Uses legacy method
- Check → `clipboard_legacy`, `success: true`

## Sample Reports

### GA4 Custom Report - Video Shares

**Dimensions:**
- Event Name: `video_share`
- Video Title (`video_title`)
- Share Method (`share_method`)
- Is Premium (`is_premium`)

**Metrics:**
- Event Count
- Success Rate (calculated: `share_success = true` / total)

### Example Queries

**Most Shared Videos:**
```sql
SELECT
  video_title,
  video_category,
  is_premium,
  COUNT(*) as share_count,
  SUM(CASE WHEN share_success = true THEN 1 ELSE 0 END) as successful_shares
FROM events
WHERE event_name = 'video_share'
GROUP BY video_title, video_category, is_premium
ORDER BY share_count DESC
LIMIT 10
```

**Share Method Distribution:**
```sql
SELECT
  share_method,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM events
WHERE event_name = 'video_share'
GROUP BY share_method
```

**Premium vs Free Share Rate:**
```sql
SELECT
  is_premium,
  COUNT(DISTINCT video_id) as unique_videos,
  COUNT(*) as total_shares,
  ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT video_id), 2) as avg_shares_per_video
FROM events
WHERE event_name = 'video_share' AND share_success = true
GROUP BY is_premium
```

## Conversion Tracking

You can use the share event for conversion tracking:

### Facebook Pixel
Track shares as custom conversions for optimization

### Google Ads
Create conversion actions based on video shares

### Audience Building
Create remarketing audiences of users who share videos:
- Users who share premium content
- Users who share specific categories
- High engagement users (multiple shares)

## Privacy & GDPR

The event tracks:
- ✅ Video metadata (public information)
- ✅ Share method (technical information)
- ✅ Page URL (already in URL bar)
- ❌ No personal information
- ❌ No user identifiers

**Recommendation:** This event should be safe under GDPR as it contains no personal data. However, always consult with your legal team.

## Troubleshooting

### Event Not Firing

1. Check browser console for errors
2. Verify GTM container is loaded:
   ```javascript
   console.log(window.dataLayer);
   ```
3. Check GTM Preview mode
4. Verify share button is working

### Data Not Appearing in GA4

1. Check GTM tag configuration
2. Verify GA4 Measurement ID is correct
3. Check GA4 DebugView (enable debug mode)
4. Allow 24-48 hours for reports to populate

### Variables Showing "undefined"

1. Check Data Layer variable names match exactly
2. Verify event is pushed before tag fires
3. Check for typos in variable configuration

## Future Enhancements

Potential additions to track:
- `user_id` (if logged in)
- `content_type` (video, image, etc.)
- `share_destination` (WhatsApp, Facebook, etc. - if detectable)
- `video_duration` and `video_progress` (how far user watched before sharing)
- `session_id` for session tracking
- `device_type` (mobile, tablet, desktop)

## Support

For questions or issues with GTM tracking:
1. Check browser console for warnings
2. Review GTM Preview mode
3. Verify dataLayer is present
4. Contact your analytics team
