// Database row types (snake_case from Supabase)
export interface CompanyRow {
  id: string;
  user_id: string;
  team_id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  assigned_to_user_id: string | null;
  claimed_by_user_id: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LoanRow {
  id: string;
  company_id: string;
  amount: number;
  currency: string;
  lender: string;
  origination_date: string;
  maturity_date: string;
  loan_type: string;
  interest_rate: number;
  status: string;
  status_updated_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AlertRow {
  id: string;
  loan_id: string;
  user_id: string;
  alert_type: string;
  days_before_maturity: number;
  sent_successfully: boolean;
  sent_at: string | null;
  created_at: string;
}

// App-level types (camelCase for frontend use)
export interface Company {
  id: string;
  userId: string;
  teamId: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  assignedToUserId: string | null;
  claimedByUserId: string | null;
  claimedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  companyId: string;
  amount: number;
  currency: string;
  lender: string;
  originationDate: string;
  maturityDate: string;
  loanType: string;
  interestRate: number;
  status: string;
  statusUpdatedAt: string;
  notes: string;
  computedStatus: 'Active' | 'Upcoming' | 'Maturing Soon' | 'Matured';
}

export interface Alert {
  id: string;
  loanId: string;
  userId: string;
  alertType: string;
  daysBeforeMaturity: number;
  sentSuccessfully: boolean;
  sentAt: string | null;
  createdAt: string;
}

// Transform functions
export function companyFromRow(row: CompanyRow): Company {
  return {
    id: row.id,
    userId: row.user_id,
    teamId: row.team_id,
    name: row.name,
    industry: row.industry,
    size: row.size,
    location: row.location,
    website: row.website,
    assignedToUserId: row.assigned_to_user_id,
    claimedByUserId: row.claimed_by_user_id,
    claimedAt: row.claimed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function loanFromRow(row: LoanRow): Loan {
  return {
    id: row.id,
    companyId: row.company_id,
    amount: row.amount,
    currency: row.currency,
    lender: row.lender,
    originationDate: row.origination_date,
    maturityDate: row.maturity_date,
    loanType: row.loan_type,
    interestRate: row.interest_rate,
    status: row.status,
    statusUpdatedAt: row.status_updated_at,
    notes: row.notes,
    computedStatus: getLoanStatus(new Date(row.maturity_date)),
  };
}

export function alertFromRow(row: AlertRow): Alert {
  return {
    id: row.id,
    loanId: row.loan_id,
    userId: row.user_id,
    alertType: row.alert_type,
    daysBeforeMaturity: row.days_before_maturity,
    sentSuccessfully: row.sent_successfully,
    sentAt: row.sent_at,
    createdAt: row.created_at,
  };
}

function getLoanStatus(maturityDate: Date): 'Active' | 'Upcoming' | 'Maturing Soon' | 'Matured' {
  const today = new Date();
  const diffTime = maturityDate.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return 'Matured';
  if (daysUntil <= 30) return 'Maturing Soon';
  if (daysUntil <= 180) return 'Upcoming';
  return 'Active';
}
