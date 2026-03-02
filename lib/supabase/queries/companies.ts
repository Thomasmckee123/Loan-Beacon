import { SupabaseClient } from '@supabase/supabase-js';
import { CompanyRow, companyFromRow, Company } from '../types';

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
