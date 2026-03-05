'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { createLoan } from '@/lib/supabase/queries';
import { queryKeys } from '@/lib/query-keys';

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      companyId: string;
      loanType: string;
      amount: number;
      currency: string;
      lender: string;
      originationDate: string;
      maturityDate: string;
      interestRate: number;
      notes: string;
    }) => {
      const supabase = createClient();
      return createLoan(supabase, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.loans.byCompany(variables.companyId),
      });
    },
  });
}
