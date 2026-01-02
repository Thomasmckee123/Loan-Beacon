export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  revenue: number; // in USD
  employees: number;
  website: string;
  contactInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  notes: string;
  createdAt: Date;
}

export interface Loan {
  id: string;
  companyId: string;
  type: string;
  amount: number; // in USD
  currency: string;
  lender: string;
  originationDate: Date;
  maturityDate: Date;
  interestRate: number; // percentage
  covenants: string;
  status: 'Active' | 'Upcoming' | 'Maturing Soon' | 'Matured';
  alertSent: boolean;
  notes: string;
}

export interface Alert {
  id: string;
  loanId: string;
  companyId: string;
  type: 'Maturity Warning' | 'Covenant Breach' | 'Rate Review';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  daysUntilMaturity: number;
  createdAt: Date;
  dismissed: boolean;
}