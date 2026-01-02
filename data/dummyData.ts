import { Company, Loan, Alert } from '@/lib/types';
import { getLoanStatus, calculateDaysUntilMaturity } from '@/lib/utils';

export const companies: Company[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    industry: 'Technology',
    location: 'San Francisco, CA',
    revenue: 125_000_000,
    employees: 450,
    website: 'https://techflow.com',
    contactInfo: {
      name: 'Sarah Chen',
      title: 'CFO',
      email: 'sarah.chen@techflow.com',
      phone: '+1 (555) 123-4567'
    },
    notes: 'Growing SaaS company with strong recurring revenue. Excellent relationship.',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Midwest Manufacturing Co.',
    industry: 'Manufacturing',
    location: 'Chicago, IL',
    revenue: 280_000_000,
    employees: 1200,
    website: 'https://midwestmfg.com',
    contactInfo: {
      name: 'John Rodriguez',
      title: 'Treasury Director',
      email: 'j.rodriguez@midwestmfg.com',
      phone: '+1 (555) 987-6543'
    },
    notes: 'Established manufacturer with solid fundamentals. Looking to expand operations.',
    createdAt: new Date('2022-11-20')
  },
  {
    id: '3',
    name: 'HealthTech Innovations',
    industry: 'Healthcare',
    location: 'Boston, MA',
    revenue: 65_000_000,
    employees: 180,
    website: 'https://healthtech-innovations.com',
    contactInfo: {
      name: 'Dr. Emily Watson',
      title: 'CEO',
      email: 'emily.watson@healthtech.com',
      phone: '+1 (555) 456-7890'
    },
    notes: 'Medical device startup with FDA approvals. High growth potential.',
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Premier Retail Group',
    industry: 'Retail',
    location: 'Atlanta, GA',
    revenue: 340_000_000,
    employees: 2800,
    website: 'https://premierretail.com',
    contactInfo: {
      name: 'Michael Thompson',
      title: 'VP Finance',
      email: 'm.thompson@premierretail.com',
      phone: '+1 (555) 321-9876'
    },
    notes: 'Multi-location retail chain. Seasonal fluctuations in cash flow.',
    createdAt: new Date('2022-08-05')
  },
  {
    id: '5',
    name: 'GreenEnergy Solutions',
    industry: 'Energy',
    location: 'Austin, TX',
    revenue: 180_000_000,
    employees: 520,
    website: 'https://greenenergy.com',
    contactInfo: {
      name: 'Lisa Park',
      title: 'CFO',
      email: 'lisa.park@greenenergy.com',
      phone: '+1 (555) 654-3210'
    },
    notes: 'Renewable energy company with government contracts. Strong ESG profile.',
    createdAt: new Date('2023-02-28')
  }
];

export const loans: Loan[] = [
  {
    id: '1',
    companyId: '1',
    type: 'Term Loan',
    amount: 50_000_000,
    currency: 'USD',
    lender: 'First National Bank',
    originationDate: new Date('2022-06-15'),
    maturityDate: new Date('2025-06-15'),
    interestRate: 5.25,
    covenants: 'Debt-to-EBITDA < 3.0x, Min DSCR 1.25x',
    status: getLoanStatus(new Date('2025-06-15')),
    alertSent: false,
    notes: 'Used for product development and market expansion'
  },
  {
    id: '2',
    companyId: '2',
    type: 'Revolving Credit',
    amount: 75_000_000,
    currency: 'USD',
    lender: 'Global Capital Bank',
    originationDate: new Date('2023-01-20'),
    maturityDate: new Date('2026-01-20'),
    interestRate: 4.75,
    covenants: 'Working capital maintenance, Asset coverage ratio > 1.5x',
    status: getLoanStatus(new Date('2026-01-20')),
    alertSent: false,
    notes: 'Working capital facility for seasonal inventory needs'
  },
  {
    id: '3',
    companyId: '3',
    type: 'Equipment Financing',
    amount: 25_000_000,
    currency: 'USD',
    lender: 'Tech Equipment Finance',
    originationDate: new Date('2023-09-10'),
    maturityDate: new Date('2025-03-15'),
    interestRate: 6.5,
    covenants: 'Equipment maintenance, Insurance requirements',
    status: getLoanStatus(new Date('2025-03-15')),
    alertSent: true,
    notes: 'Financing for new medical equipment and lab setup'
  },
  {
    id: '4',
    companyId: '4',
    type: 'Term Loan',
    amount: 120_000_000,
    currency: 'USD',
    lender: 'Retail Finance Corp',
    originationDate: new Date('2021-11-01'),
    maturityDate: new Date('2024-11-01'),
    interestRate: 4.25,
    covenants: 'Store count maintenance, Inventory turnover > 4x',
    status: getLoanStatus(new Date('2024-11-01')),
    alertSent: true,
    notes: 'Store expansion and renovation project funding'
  },
  {
    id: '5',
    companyId: '5',
    type: 'Project Finance',
    amount: 200_000_000,
    currency: 'USD',
    lender: 'Green Infrastructure Fund',
    originationDate: new Date('2022-04-12'),
    maturityDate: new Date('2027-04-12'),
    interestRate: 3.95,
    covenants: 'Project completion milestones, Environmental compliance',
    status: getLoanStatus(new Date('2027-04-12')),
    alertSent: false,
    notes: 'Solar farm development project in West Texas'
  },
  {
    id: '6',
    companyId: '1',
    type: 'Bridge Loan',
    amount: 30_000_000,
    currency: 'USD',
    lender: 'Quick Capital Partners',
    originationDate: new Date('2024-01-15'),
    maturityDate: new Date('2025-01-15'),
    interestRate: 7.5,
    covenants: 'Refinancing deadline, Cash flow monitoring',
    status: getLoanStatus(new Date('2025-01-15')),
    alertSent: true,
    notes: 'Bridge financing for acquisition pending permanent financing'
  },
  {
    id: '7',
    companyId: '2',
    type: 'Term Loan',
    amount: 85_000_000,
    currency: 'USD',
    lender: 'Industrial Development Bank',
    originationDate: new Date('2023-07-20'),
    maturityDate: new Date('2025-07-20'),
    interestRate: 5.0,
    covenants: 'Production targets, Quality certifications',
    status: getLoanStatus(new Date('2025-07-20')),
    alertSent: false,
    notes: 'New manufacturing facility in Mexico'
  },
  {
    id: '8',
    companyId: '3',
    type: 'Mezzanine Debt',
    amount: 40_000_000,
    currency: 'USD',
    lender: 'Growth Capital Fund',
    originationDate: new Date('2023-12-05'),
    maturityDate: new Date('2025-02-28'),
    interestRate: 12.0,
    covenants: 'Revenue milestones, Board representation',
    status: getLoanStatus(new Date('2025-02-28')),
    alertSent: true,
    notes: 'Growth capital for R&D and FDA trial expansion'
  }
];

export const alerts: Alert[] = [
  {
    id: '1',
    loanId: '3',
    companyId: '3',
    type: 'Maturity Warning',
    priority: 'High',
    message: 'Equipment financing loan matures in 73 days. Refinancing discussions should begin immediately.',
    daysUntilMaturity: calculateDaysUntilMaturity(new Date('2025-03-15')),
    createdAt: new Date('2024-12-15'),
    dismissed: false
  },
  {
    id: '2',
    loanId: '8',
    companyId: '3',
    type: 'Maturity Warning',
    priority: 'Critical',
    message: 'Mezzanine debt matures in 57 days. High interest rate facility needs attention.',
    daysUntilMaturity: calculateDaysUntilMaturity(new Date('2025-02-28')),
    createdAt: new Date('2024-12-20'),
    dismissed: false
  },
  {
    id: '3',
    loanId: '6',
    companyId: '1',
    type: 'Maturity Warning',
    priority: 'High',
    message: 'Bridge loan matures in 13 days. Permanent financing must be secured urgently.',
    daysUntilMaturity: calculateDaysUntilMaturity(new Date('2025-01-15')),
    createdAt: new Date('2024-12-28'),
    dismissed: false
  },
  {
    id: '4',
    loanId: '1',
    companyId: '1',
    type: 'Maturity Warning',
    priority: 'Medium',
    message: 'Term loan matures in 164 days. Begin refinancing process within next 30 days.',
    daysUntilMaturity: calculateDaysUntilMaturity(new Date('2025-06-15')),
    createdAt: new Date('2024-12-25'),
    dismissed: false
  },
  {
    id: '5',
    loanId: '7',
    companyId: '2',
    type: 'Rate Review',
    priority: 'Low',
    message: 'Term loan eligible for rate reduction review based on improved credit profile.',
    daysUntilMaturity: calculateDaysUntilMaturity(new Date('2025-07-20')),
    createdAt: new Date('2024-12-30'),
    dismissed: false
  }
];