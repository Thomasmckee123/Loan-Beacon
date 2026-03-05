'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getCompanies, getCompany } from '@/lib/supabase/queries';
import { queryKeys } from '@/lib/query-keys';

export function useCompanies() {
  return useQuery({
    queryKey: queryKeys.companies.all,
    queryFn: () => {
      const supabase = createClient();
      return getCompanies(supabase);
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => {
      const supabase = createClient();
      return getCompany(supabase, id);
    },
    enabled: !!id,
  });
}
