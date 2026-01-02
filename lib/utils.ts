/**
 * Format currency amounts as $50M, $2.1B, etc.
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
}

/**
 * Format dates in a readable format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Calculate days until maturity date
 */
export function calculateDaysUntilMaturity(maturityDate: Date): number {
  const today = new Date();
  const diffTime = maturityDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get status based on days until maturity
 */
export function getLoanStatus(maturityDate: Date): 'Active' | 'Upcoming' | 'Maturing Soon' | 'Matured' {
  const daysUntil = calculateDaysUntilMaturity(maturityDate);
  
  if (daysUntil < 0) return 'Matured';
  if (daysUntil <= 30) return 'Maturing Soon';
  if (daysUntil <= 180) return 'Upcoming';
  return 'Active';
}