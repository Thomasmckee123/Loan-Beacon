import { SupabaseClient } from '@supabase/supabase-js';
import { CompanyRow, companyFromRow, Company } from '../types';

export async function getCompanies(supabase: SupabaseClient): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as CompanyRow[]).map(companyFromRow);
}

export async function getCompany(supabase: SupabaseClient, id: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) return null;
  return companyFromRow(data as CompanyRow);
}

export async function createCompany(
  supabase: SupabaseClient,
  company: {
    name: string;
    industry: string;
    size: string;
    location: string;
    website: string;
  }
): Promise<Company> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Look up the user's team_id from the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('team_id')
    .eq('id', user.id)
    .single();

  if (userError || !userData) throw new Error('User profile not found');

  const { data, error } = await supabase
    .from('companies')
    .insert({
      user_id: user.id,
      team_id: userData.team_id,
      name: company.name,
      industry: company.industry,
      size: company.size,
      location: company.location,
      website: company.website,
    })
    .select()
    .single();

  if (error) throw error;
  return companyFromRow(data as CompanyRow);
}
