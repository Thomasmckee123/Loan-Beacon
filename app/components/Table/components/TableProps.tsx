import { ReactNode } from "react";
import { Company, Loan } from "@/lib/supabase/types";
import {
  formatCurrency,
  formatDate,
  calculateDaysUntilMaturity,
  getSizeColor,
  getStatusColor,
  randomColor,
} from "@/lib/utils";

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
  align?: "left" | "right";
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  getRowBorderColor?: (row: T) => string;
}

export type CompanyRow = Company & { loans: Loan[] };
export type LoanRow = Loan & { companyName?: string; companyIndustry?: string };

const pillClass =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

// Light text for the dark navy-800 row hover/focus pill (WCAG AA on navy-800)
const hoverPrimary = "group-hover:text-white group-focus-visible:text-white";
const hoverSecondary =
  "group-hover:text-navy-200 group-focus-visible:text-navy-200";
const hoverWarning = "group-hover:text-red-300 group-focus-visible:text-red-300";

export const companyColumns: Column<CompanyRow>[] = [
  {
    id: "company",
    header: "Company",
    accessor: (row) => (
      <div>
        <div className={`text-sm font-semibold text-navy-800 ${hoverPrimary}`}>{row.name}</div>
        <div className={`text-xs text-gray-600 ${hoverSecondary}`}>{row.location}</div>
      </div>
    ),
  },
  {
    id: "industry",
    header: "Industry",
    accessor: (row) => {
      const color = randomColor(row.industry);
      return (
        <span className={`${pillClass} ${color.bg} ${color.text}`}>
          {row.industry}
        </span>
      );
    },
  },
  {
    id: "size",
    header: "Size",
    accessor: (row) => {
      const color = getSizeColor(row.size);
      return (
        <span className={`${pillClass} ${color.bg} ${color.text}`}>
          {row.size}
        </span>
      );
    },
  },
  {
    id: "loans",
    header: "Loans",
    align: "right",
    accessor: (row) => {
      const totalAmount = row.loans.reduce((sum, loan) => sum + loan.amount, 0);
      return (
        <div>
          <div className={`text-sm font-medium text-gray-900 ${hoverPrimary}`}>
            {row.loans.length} loans
          </div>
          <div className={`text-xs text-gray-600 ${hoverSecondary}`}>
            {formatCurrency(totalAmount)} total
          </div>
        </div>
      );
    },
  },
];

export const loanColumns: Column<LoanRow>[] = [
  {
    id: "company",
    header: "Company",
    accessor: (row) => (
      <div>
        <div className={`text-sm font-semibold text-navy-800 ${hoverPrimary}`}>
          {row.companyName}
        </div>
        <div className={`text-xs text-gray-600 ${hoverSecondary}`}>{row.companyIndustry}</div>
      </div>
    ),
  },
  {
    id: "loanDetails",
    header: "Loan Details",
    accessor: (row) => (
      <div>
        <div className={`text-sm font-medium text-gray-900 ${hoverPrimary}`}>{row.loanType}</div>
        <div className={`text-xs text-gray-600 ${hoverSecondary}`}>{row.lender}</div>
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    accessor: (row) => (
      <div>
        <div className={`text-sm text-gray-900 ${hoverPrimary}`}>
          {formatCurrency(row.amount)}
        </div>
        <div className={`text-xs text-gray-600 ${hoverSecondary}`}>{row.interestRate}% rate</div>
      </div>
    ),
  },
  {
    id: "maturity",
    header: "Maturity",
    accessor: (row) => {
      const daysUntil = calculateDaysUntilMaturity(row.maturityDate);
      return (
        <div className="tabular-nums">
          <div className={`text-sm text-gray-900 ${hoverPrimary}`}>
            {formatDate(row.maturityDate)}
          </div>
          <div
            className={`text-xs font-medium ${daysUntil < 30 ? `text-red-700 ${hoverWarning}` : `text-gray-600 ${hoverSecondary}`}`}
          >
            {daysUntil > 0 ? `${daysUntil} days` : "Overdue"}
          </div>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => {
      const color = getStatusColor(row.computedStatus);
      return (
        <span className={`${pillClass} ${color.bg} ${color.text}`}>
          {row.computedStatus}
        </span>
      );
    },
  },
];
