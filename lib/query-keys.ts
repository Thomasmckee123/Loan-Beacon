export const queryKeys = {
  companies: {
    all: ['companies'] as const,
    detail: (id: string) => ['companies', id] as const,
  },
  loans: {
    all: ['loans'] as const,
    byCompany: (companyId: string) => ['loans', 'company', companyId] as const,
  },
  alerts: {
    all: ['alerts'] as const,
  },
} as const;
