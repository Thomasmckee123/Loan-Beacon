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

export async function dismissAlert(supabase: SupabaseClient, alertId: string): Promise<void> {
  const { error } = await supabase
    .from('alert_logs')
    .update({ dismissed: true })
    .eq('id', alertId);

  if (error) throw error;
}

export async function restoreAlert(supabase: SupabaseClient, alertId: string): Promise<void> {
  const { error } = await supabase
    .from('alert_logs')
    .update({ dismissed: false })
    .eq('id', alertId);

  if (error) throw error;
}
