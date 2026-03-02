import { SupabaseClient } from '@supabase/supabase-js';
import {
  CompanyRow,
  LoanRow,
  AlertRow,
  companyFromRow,
  loanFromRow,
  alertFromRow,
  Company,
  Loan,
  Alert,
} from './types';

// ============================================
// COMPANIES
// ============================================

export async function getCompanies(supabase: SupabaseClient): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as CompanyRow[]).map(companyFromRow);
}

export async function getCompany(supabase: SupabaseClient, id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return companyFromRow(data as CompanyRow);
}

export async function createCompany(
  supabase: SupabaseClient,
  company: {
    name: string;
    industry: string;
    location: string;
    revenue: number;
    employees: number;
    website: string;
    contactName: string;
    contactTitle: string;
    contactEmail: string;
    contactPhone: string;
    notes: string;
  }
): Promise<Company> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('companies')
    .insert({
      user_id: user.id,
      name: company.name,
      industry: company.industry,
      location: company.location,
      revenue: company.revenue,
      employees: company.employees,
      website: company.website,
      contact_name: company.contactName,
      contact_title: company.contactTitle,
      contact_email: company.contactEmail,
      contact_phone: company.contactPhone,
      notes: company.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return companyFromRow(data as CompanyRow);
}

// ============================================
// LOANS
// ============================================

export async function getLoans(supabase: SupabaseClient): Promise<Loan[]> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .order('maturity_date', { ascending: true });

  if (error) throw error;
  return (data as LoanRow[]).map(loanFromRow);
}

export async function getLoansByCompany(supabase: SupabaseClient, companyId: string): Promise<Loan[]> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('company_id', companyId)
    .order('maturity_date', { ascending: true });

  if (error) throw error;
  return (data as LoanRow[]).map(loanFromRow);
}

export async function createLoan(
  supabase: SupabaseClient,
  loan: {
    companyId: string;
    type: string;
    amount: number;
    currency: string;
    lender: string;
    originationDate: string;
    maturityDate: string;
    interestRate: number;
    covenants: string;
    notes: string;
  }
): Promise<Loan> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('loans')
    .insert({
      user_id: user.id,
      company_id: loan.companyId,
      type: loan.type,
      amount: loan.amount,
      currency: loan.currency,
      lender: loan.lender,
      origination_date: loan.originationDate,
      maturity_date: loan.maturityDate,
      interest_rate: loan.interestRate,
      covenants: loan.covenants,
      notes: loan.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return loanFromRow(data as LoanRow);
}

// ============================================
// ALERTS
// ============================================

export async function getAlerts(supabase: SupabaseClient): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as AlertRow[]).map(alertFromRow);
}

export async function dismissAlert(supabase: SupabaseClient, alertId: string): Promise<void> {
  const { error } = await supabase
    .from('alerts')
    .update({ dismissed: true })
    .eq('id', alertId);

  if (error) throw error;
}

export async function restoreAlert(supabase: SupabaseClient, alertId: string): Promise<void> {
  const { error } = await supabase
    .from('alerts')
    .update({ dismissed: false })
    .eq('id', alertId);

  if (error) throw error;
}
