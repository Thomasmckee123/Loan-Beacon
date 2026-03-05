'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { createCompany } from '@/lib/supabase/queries';
import { queryKeys } from '@/lib/query-keys';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      industry: string;
      size: string;
      location: string;
      website: string;
    }) => {
      const supabase = createClient();
      return createCompany(supabase, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
    },
  });
}
