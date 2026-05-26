// =====================================================
// FORMATTING UTILITIES
// =====================================================

/**
 * Format a number with specified decimal places
 */
export function formatNumber(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '--';
  return Number(value).toFixed(decimals);
}

/**
 * Format a number as Indonesian Rupiah currency
 */
export function formatRupiah(value) {
  if (value === null || value === undefined || isNaN(value)) return '--';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

/**
 * Format a timestamp string to readable date/time
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '--';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return timestamp;
  }
}

/**
 * Format timestamp for chart X-axis (short format)
 */
export function formatChartTime(timestamp) {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * Format date only
 */
export function formatDate(timestamp) {
  if (!timestamp) return '--';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return timestamp;
  }
}

/**
 * Get relative time string (e.g., "2 menit yang lalu")
 */
export function getRelativeTime(timestamp) {
  if (!timestamp) return '--';

  try {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 60) return `${diffSec} detik yang lalu`;
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    return formatTimestamp(timestamp);
  } catch {
    return '--';
  }
}
