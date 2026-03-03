import { SupabaseClient } from '@supabase/supabase-js';
import { AlertRow, alertFromRow, Alert } from '../types';

export async function getAlerts(supabase: SupabaseClient): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alert_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as AlertRow[]).map(alertFromRow);
}
