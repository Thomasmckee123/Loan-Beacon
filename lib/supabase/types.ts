// Database row types (snake_case from Supabase)
export interface CompanyRow {
  id: string;
  user_id: string;
  name: string;
  industry: string;
  location: string;
  revenue: number;
  employees: number;
  website: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LoanRow {
  id: string;
  user_id: string;
  company_id: string;
  type: string;
  amount: number;
  currency: string;
  lender: string;
  origination_date: string;
  maturity_date: string;
  interest_rate: number;
  covenants: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AlertRow {
  id: string;
  user_id: string;
  loan_id: string;
  company_id: string;
  type: 'Maturity Warning' | 'Covenant Breach' | 'Rate Review';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  days_until_maturity: number;
  dismissed: boolean;
  created_at: string;
}

// App-level types (camelCase for frontend use)
export interface Company {
  id: string;
  userId: string;
  name: string;
  industry: string;
  location: string;
  revenue: number;
  employees: number;
  website: string;
  contactInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  notes: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  companyId: string;
  type: string;
  amount: number;
  currency: string;
  lender: string;
  originationDate: string;
  maturityDate: string;
  interestRate: number;
  covenants: string;
  status: 'Active' | 'Upcoming' | 'Maturing Soon' | 'Matured';
  notes: string;
}

export interface Alert {
  id: string;
  userId: string;
  loanId: string;
  companyId: string;
  type: 'Maturity Warning' | 'Covenant Breach' | 'Rate Review';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  daysUntilMaturity: number;
  dismissed: boolean;
  createdAt: string;
}

// Transform functions
export function companyFromRow(row: CompanyRow): Company {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    industry: row.industry,
    location: row.location,
    revenue: row.revenue,
    employees: row.employees,
    website: row.website,
    contactInfo: {
      name: row.contact_name,
      title: row.contact_title,
      email: row.contact_email,
      phone: row.contact_phone,
    },
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function loanFromRow(row: LoanRow): Loan {
  return {
    id: row.id,
    userId: row.user_id,
    companyId: row.company_id,
    type: row.type,
    amount: row.amount,
    currency: row.currency,
    lender: row.lender,
    originationDate: row.origination_date,
    maturityDate: row.maturity_date,
    interestRate: row.interest_rate,
    covenants: row.covenants,
    status: getLoanStatus(new Date(row.maturity_date)),
    notes: row.notes,
  };
}

export function alertFromRow(row: AlertRow): Alert {
  return {
    id: row.id,
    userId: row.user_id,
    loanId: row.loan_id,
    companyId: row.company_id,
    type: row.type,
    priority: row.priority,
    message: row.message,
    daysUntilMaturity: row.days_until_maturity,
    dismissed: row.dismissed,
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
