# Google Tag Manager - Payment Interaction Events

## Event Overview

The payment page tracks three key user interactions to help understand payment flow engagement and user behavior during the checkout process.

## Events

### 1. Payment Copy Event (`payment_copy`)

Triggered when a user copies payment information (amount, address, or payment URI).

#### Event Structure

```javascript
window.dataLayer.push({
  event: 'payment_copy',
  copy_type: 'amount',              // 'amount', 'address', or 'uri'
  payment_id: '269',                // Payment ID (string)
  payment_status: 'pending',        // Payment status (string)
  payment_method: 'crypto',         // Payment method (string)
  currency: 'BTC',                  // Crypto currency code (string)
  amount_usd: '96.00',              // USD amount (string)
  crypto_amount: '0.000885257...',  // Crypto amount (optional, only for 'amount' type)
  payment_address: 'bcrt1q...',     // Payment address (optional, only for 'address' type)
  page_url: 'https://...',          // Full page URL (string)
  timestamp: '2025-10-19T...',      // ISO timestamp (string)
});
```

#### Copy Types

| Type | Description | Additional Fields |
|------|-------------|------------------|
| `amount` | User copied crypto amount | `crypto_amount` |
| `address` | User copied payment address | `payment_address` |
| `uri` | User copied payment URI | None |

### 2. Payment Wallet Open Event (`payment_wallet_open`)

Triggered when a user clicks the "Open in Wallet App" button.

#### Event Structure

```javascript
window.dataLayer.push({
  event: 'payment_wallet_open',
  payment_id: '269',                // Payment ID (string)
  payment_status: 'pending',        // Payment status (string)
  payment_method: 'crypto',         // Payment method (string)
  currency: 'BTC',                  // Crypto currency code (string)
  network: 'mainnet',               // Blockchain network (string)
  amount_usd: '96.00',              // USD amount (string)
  crypto_amount: '0.000885257...',  // Crypto amount (string)
  page_url: 'https://...',          // Full page URL (string)
  timestamp: '2025-10-19T...',      // ISO timestamp (string)
});
```

## GTM Setup

### 1. Create Data Layer Variables

Create the following Data Layer Variables in GTM:

| Variable Name | Data Layer Variable Name |
|---------------|-------------------------|
| `DLV - Payment ID` | `payment_id` |
| `DLV - Payment Status` | `payment_status` |
| `DLV - Payment Method` | `payment_method` |
| `DLV - Copy Type` | `copy_type` |
| `DLV - Currency` | `currency` |
| `DLV - Network` | `network` |
| `DLV - Amount USD` | `amount_usd` |
| `DLV - Crypto Amount` | `crypto_amount` |
| `DLV - Payment Address` | `payment_address` |
| `DLV - Event Timestamp` | `timestamp` |

### 2. Create Custom Event Triggers

#### Payment Copy Trigger
- Trigger Type: `Custom Event`
- Event Name: `payment_copy`
- This trigger fires on: `All Custom Events`

#### Payment Wallet Open Trigger
- Trigger Type: `Custom Event`
- Event Name: `payment_wallet_open`
- This trigger fires on: `All Custom Events`

### 3. Example Tags

#### Google Analytics 4 - Payment Copy Event
```
Tag Type: Google Analytics: GA4 Event
Event Name: payment_copy

Event Parameters:
- payment_id: {{DLV - Payment ID}}
- copy_type: {{DLV - Copy Type}}
- payment_status: {{DLV - Payment Status}}
- currency: {{DLV - Currency}}
- amount_usd: {{DLV - Amount USD}}
- crypto_amount: {{DLV - Crypto Amount}}

Trigger: payment_copy (Custom Event)
```

#### Google Analytics 4 - Wallet Open Event
```
Tag Type: Google Analytics: GA4 Event
Event Name: payment_wallet_open

Event Parameters:
- payment_id: {{DLV - Payment ID}}
- payment_status: {{DLV - Payment Status}}
- currency: {{DLV - Currency}}
- network: {{DLV - Network}}
- amount_usd: {{DLV - Amount USD}}
- crypto_amount: {{DLV - Crypto Amount}}

Trigger: payment_wallet_open (Custom Event)
```

## Use Cases

### 1. Payment Friction Analysis

Track which step users struggle with:
- High `payment_copy` events for address → Users prefer manual copy over wallet app
- Low `payment_wallet_open` events → Wallet integration not being used
- Multiple copy events for same payment → Users may be confused

### 2. User Behavior Patterns

Identify user preferences:
- Desktop users: More likely to copy/paste manually
- Mobile users: More likely to use wallet apps
- Different behaviors by cryptocurrency

### 3. Conversion Funnel

Track the payment completion funnel:
1. Payment page view
2. Copy amount (`payment_copy` with `copy_type: amount`)
3. Copy address (`payment_copy` with `copy_type: address`)
4. Or wallet open (`payment_wallet_open`)
5. Payment completed

### 4. A/B Testing

Test different UX improvements:
- Wallet button placement
- Copy button design
- QR code prominence
- Payment instructions clarity

## Sample Reports

### GA4 Custom Report - Payment Interactions

**Dimensions:**
- Event Name (`payment_copy`, `payment_wallet_open`)
- Copy Type (`copy_type`)
- Currency (`currency`)
- Payment Status (`payment_status`)

**Metrics:**
- Event Count
- Unique Payments
- Average time to copy
- Conversion Rate

### Example Queries

**Most Copied Information:**
```sql
SELECT
  copy_type,
  currency,
  COUNT(*) as copy_count,
  COUNT(DISTINCT payment_id) as unique_payments
FROM events
WHERE event_name = 'payment_copy'
GROUP BY copy_type, currency
ORDER BY copy_count DESC
```

**Wallet vs Manual Copy:**
```sql
SELECT
  currency,
  COUNT(CASE WHEN event_name = 'payment_wallet_open' THEN 1 END) as wallet_opens,
  COUNT(CASE WHEN event_name = 'payment_copy' THEN 1 END) as manual_copies,
  ROUND(
    COUNT(CASE WHEN event_name = 'payment_wallet_open' THEN 1 END) * 100.0 /
    NULLIF(COUNT(*), 0), 2
  ) as wallet_preference_pct
FROM events
WHERE event_name IN ('payment_wallet_open', 'payment_copy')
GROUP BY currency
```

**Average Copies Per Payment:**
```sql
SELECT
  payment_status,
  AVG(copy_count) as avg_copies_per_payment
FROM (
  SELECT
    payment_id,
    payment_status,
    COUNT(*) as copy_count
  FROM events
  WHERE event_name = 'payment_copy'
  GROUP BY payment_id, payment_status
)
GROUP BY payment_status
```

## Testing

### 1. Test Payment Copy - Amount

1. Navigate to payment page
2. Click "Copy" button next to the crypto amount
3. Check browser console for:
   ```javascript
   GTM Event Tracked: {
     event: 'payment_copy',
     copy_type: 'amount',
     payment_id: '269',
     currency: 'BTC',
     crypto_amount: '0.000885257692981566'
   }
   ```

### 2. Test Payment Copy - Address

1. Click "Copy" button next to payment address
2. Check browser console for:
   ```javascript
   GTM Event Tracked: {
     event: 'payment_copy',
     copy_type: 'address',
     payment_id: '269',
     payment_address: 'bcrt1qnd0au55z8693jxy27hxqatnw6vhy5fmspy2gcy'
   }
   ```

### 3. Test Wallet Open

1. Click "Open in Wallet App" button
2. Check browser console for:
   ```javascript
   GTM Event Tracked: payment_wallet_open
   ```
3. Verify wallet app attempts to open (or URI is copied as fallback)

### 4. Verify in GTM Preview

1. Open GTM Preview mode
2. Perform the actions above
3. Check that events fire in GTM Preview
4. Verify all data layer variables are populated correctly

## Conversion Goals

Create conversion goals for successful payments:

1. **Payment Initiated**: User copies amount or address
2. **Payment Submitted**: Transaction detected on blockchain
3. **Payment Confirmed**: Min confirmations reached
4. **Payment Finalized**: Required confirmations reached

## Remarketing Audiences

Create audiences for remarketing:

### Abandoned Payments
- Users who copied payment info but didn't complete
- Timeframe: Last 24 hours
- Use for: Re-engagement emails

### High-Value Customers
- Users who completed payments > $100
- Use for: VIP tier offers

### Crypto Preference
- Users by preferred cryptocurrency (BTC, ETH, etc.)
- Use for: Targeted promotions

## Privacy & GDPR

The events track:
- ✅ Payment ID (transaction reference, not personal)
- ✅ Payment amount (public transaction info)
- ✅ Cryptocurrency type (public)
- ✅ Copy actions (user interaction)
- ❌ No personal information
- ❌ No wallet addresses stored long-term

**Recommendation:**
- Ensure user consent for analytics tracking via cookie consent
- Payment IDs are anonymized transaction references
- Follow payment card industry (PCI) compliance if applicable

## Troubleshooting

### Event Not Firing

1. Check browser console for "GTM Event Tracked" message
2. Verify GTM container is loaded (check network tab)
3. Check if `window.dataLayer` exists in console
4. Verify cookie consent allows analytics

### Wrong Data in Events

1. Check payment data is loaded (`paymentData` state)
2. Verify crypto details exist (`paymentData.crypto`)
3. Check console logs for data structure
4. Ensure API response matches expected format

### Copy Function Not Working

1. Verify clipboard API is supported (HTTPS required)
2. Check browser console for errors
3. Test in different browsers
4. Verify user has granted clipboard permissions

## Integration Notes

### Payment Status Updates

When payment status changes (via WebSocket or polling), you may want to track additional events:

```javascript
// When min_confirmations reached
window.dataLayer.push({
  event: 'payment_confirmed',
  payment_id: '269',
  confirmations: 1,
  min_confirmations: 1,
  required_confirmations: 3,
  // ... other fields
});

// When required_confirmations reached
window.dataLayer.push({
  event: 'payment_finalized',
  payment_id: '269',
  confirmations: 3,
  // ... other fields
});
```

### Error Tracking

Track payment errors for debugging:

```javascript
window.dataLayer.push({
  event: 'payment_error',
  error_type: 'expired',
  payment_id: '269',
  // ... other fields
});
```

## Future Enhancements

- Track QR code scans (if detectable)
- Track time spent on payment page
- Track payment retry attempts
- Track network warnings viewed
- A/B test different copy button styles
- Track confirmation progress milestones

## Support

For questions or issues:
1. Check browser console for GTM events
2. Review GTM Preview mode
3. Verify payment data structure
4. Check API responses
