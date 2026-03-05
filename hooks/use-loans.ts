'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getLoans, getLoansByCompany } from '@/lib/supabase/queries';
import { queryKeys } from '@/lib/query-keys';

export function useLoans() {
  return useQuery({
    queryKey: queryKeys.loans.all,
    queryFn: () => {
      const supabase = createClient();
      return getLoans(supabase);
    },
  });
}

export function useLoansByCompany(companyId: string) {
  return useQuery({
    queryKey: queryKeys.loans.byCompany(companyId),
    queryFn: () => {
      const supabase = createClient();
      return getLoansByCompany(supabase, companyId);
    },
    enabled: !!companyId,
  });
}
