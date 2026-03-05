'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getAlerts } from '@/lib/supabase/queries';
import { queryKeys } from '@/lib/query-keys';

export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts.all,
    queryFn: () => {
      const supabase = createClient();
      return getAlerts(supabase);
    },
  });
}
