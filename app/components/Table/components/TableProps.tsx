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
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export type CompanyRow = Company & { loans: Loan[] };
export type LoanRow = Loan & { companyName?: string; companyIndustry?: string };

export const companyColumns: Column<CompanyRow>[] = [
  {
    id: "company",
    header: "Company",
    accessor: (row) => (
      <div>
        <div className="text-xl font-medium text-navy-700 hover:text-navy-600">
          {row.name}
        </div>
        <div className="text-sm text-gray-500">{row.location}</div>
      </div>
    ),
  },
  {
    id: "industry",
    header: "Industry",
    accessor: (row) => {
      const color = randomColor(row.industry);
      return (
        <span
          className={`p-3 inline-flex text-md leading-5 font-semibold rounded-full ${color.bg} ${color.text}`}
        >
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
        <span
          className={`p-3 inline-flex text-md leading-5 font-semibold rounded-full ${color.bg} ${color.text}`}
        >
          {row.size}
        </span>
      );
    },
  },
  {
    id: "loans",
    header: "Loans",
    accessor: (row) => {
      const totalAmount = row.loans.reduce((sum, loan) => sum + loan.amount, 0);
      return (
        <div>
          <div className="text-lg text-gray-900">{row.loans.length} loans</div>
          <div className="text-sm text-gray-500">
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
        <div className="text-xl font-medium text-navy-700">
          {row.companyName}
        </div>
        <div className="text-sm text-gray-500">{row.companyIndustry}</div>
      </div>
    ),
  },
  {
    id: "loanDetails",
    header: "Loan Details",
    accessor: (row) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{row.loanType}</div>
        <div className="text-sm text-gray-500">{row.lender}</div>
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    accessor: (row) => (
      <div>
        <div className="text-sm text-gray-900">
          {formatCurrency(row.amount)}
        </div>
        <div className="text-sm text-gray-500">{row.interestRate}% rate</div>
      </div>
    ),
  },
  {
    id: "maturity",
    header: "Maturity",
    accessor: (row) => {
      const daysUntil = calculateDaysUntilMaturity(row.maturityDate);
      return (
        <div>
          <div className="text-sm text-gray-900">
            {formatDate(row.maturityDate)}
          </div>
          <div
            className={`text-sm ${daysUntil < 30 ? "text-red-600" : "text-gray-500"}`}
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
        <span
          className={`p-3 inline-flex text-md leading-5 font-semibold rounded-full ${color.bg} ${color.text}`}
        >
          {row.computedStatus}
        </span>
      );
    },
  },
];
