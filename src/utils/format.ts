/**
 * Formats a numeric price into localized currency (INR for India market)
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '₹0.00';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // Luxury pricing usually omits paise decimals
  }).format(numericAmount);
}

/**
 * Formats mirror dimensions from millimeters to standard display format (e.g., 600 x 900 mm)
 */
export function formatDimensions(width: number, height: number): string {
  return `${width} x ${height} mm`;
}

/**
 * Converts millimeters to inches for local custom buyers who think in traditional sizes
 * 1 inch = 25.4 mm
 */
export function mmToInches(mm: number): number {
  return Math.round((mm / 25.4) * 10) / 10;
}

/**
 * Localized date formatter for premium order receipts and dashboards
 */
export function formatDate(date: Date | string): string {
  const resolvedDate = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(resolvedDate);
}
