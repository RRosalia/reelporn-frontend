/**
 * Format a date using PHP-style date format strings
 * Supports common format characters: d, m, Y, y, M, F, j, n
 */
export function formatDate(date: Date, format: string): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formatMap: { [key: string]: string } = {
    'd': pad(date.getDate()),                    // Day of month with leading zeros (01-31)
    'j': date.getDate().toString(),               // Day of month without leading zeros (1-31)
    'm': pad(date.getMonth() + 1),                // Month with leading zeros (01-12)
    'n': (date.getMonth() + 1).toString(),        // Month without leading zeros (1-12)
    'Y': date.getFullYear().toString(),           // Full year (2025)
    'y': date.getFullYear().toString().slice(-2), // Two digit year (25)
    'F': months[date.getMonth()],                 // Full month name (January)
    'M': monthsShort[date.getMonth()],            // Short month name (Jan)
  };

  let result = format;
  for (const [key, value] of Object.entries(formatMap)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }

  return result;
}

/**
 * Get the last updated date for static pages (01/10/2025)
 */
export function getLastUpdatedDate(): Date {
  return new Date(2025, 9, 1); // October 1, 2025 (month is 0-indexed)
}
