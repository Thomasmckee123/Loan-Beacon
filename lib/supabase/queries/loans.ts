import { SupabaseClient } from '@supabase/supabase-js';
import { LoanRow, loanFromRow, Loan } from '../types';

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
