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
    loanType: string;
    amount: number;
    currency: string;
    lender: string;
    originationDate: string;
    maturityDate: string;
    interestRate: number;
    notes: string;
  }
): Promise<Loan> {
  const { data, error } = await supabase
    .from('loans')
    .insert({
      company_id: loan.companyId,
      loan_type: loan.loanType,
      amount: loan.amount,
      currency: loan.currency,
      lender: loan.lender,
      origination_date: loan.originationDate,
      maturity_date: loan.maturityDate,
      interest_rate: loan.interestRate,
      status: 'not_contacted',
      notes: loan.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return loanFromRow(data as LoanRow);
}
