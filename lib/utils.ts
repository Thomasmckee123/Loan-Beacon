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
    return `$${amount?.toLocaleString()}`;
  }
}

/**
 * Format dates in a readable format
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Calculate days until maturity date
 */
export function calculateDaysUntilMaturity(maturityDate: Date | string): number {
  const maturityDateObj = typeof maturityDate === 'string' ? new Date(maturityDate) : maturityDate;
  const today = new Date();
  const diffTime = maturityDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get a consistent color pair (bg + text) for an industry string.
 * Same industry always returns the same color.
 */
const industryColorMap: Record<string, { bg: string; text: string }> = {};
const industryColors = [
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-emerald-100", text: "text-emerald-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
  { bg: "bg-cyan-100", text: "text-cyan-800" },
  { bg: "bg-orange-100", text: "text-orange-800" },
  { bg: "bg-indigo-100", text: "text-indigo-800" },
  { bg: "bg-teal-100", text: "text-teal-800" },
  { bg: "bg-pink-100", text: "text-pink-800" },
];

export function randomColor(industry: string): { bg: string; text: string } {
  if (industryColorMap[industry]) return industryColorMap[industry];

  // Hash the string to get a stable index
  let hash = 0;
  for (let i = 0; i < industry.length; i++) {
    hash = industry.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % industryColors.length;
  industryColorMap[industry] = industryColors[index];
  return industryColors[index];
}

/**
 * Get color pair for company size.
 */
const sizeColors: Record<string, { bg: string; text: string }> = {
  Small: { bg: "bg-sky-100", text: "text-sky-800" },
  Medium: { bg: "bg-amber-100", text: "text-amber-800" },
  Large: { bg: "bg-violet-100", text: "text-violet-800" },
  Enterprise: { bg: "bg-rose-100", text: "text-rose-800" },
};

const defaultSizeColor = { bg: "bg-gray-100", text: "text-gray-800" };

export function getSizeColor(size: string): { bg: string; text: string } {
  return sizeColors[size] ?? defaultSizeColor;
}

/**
 * Get color pair for loan status.
 */
const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-green-100", text: "text-green-800" },
  Upcoming: { bg: "bg-navy-100", text: "text-navy-800" },
  "Maturing Soon": { bg: "bg-orange-100", text: "text-orange-800" },
  Matured: { bg: "bg-red-100", text: "text-red-800" },
};

const defaultStatusColor = { bg: "bg-gray-100", text: "text-gray-800" };

export function getStatusColor(status: string): { bg: string; text: string } {
  return statusColors[status] ?? defaultStatusColor;
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

export function getLoanDetails(loanType: string, lender: string): string {
  return `${loanType} loan from ${lender}`;
}