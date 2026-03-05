import { ReactNode } from "react";
import Link from "next/link";
import { Company, Loan } from "@/lib/supabase/types";
import { formatCurrency, getIndustryColor } from "@/lib/utils";

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

// --- Company table columns ---

export type CompanyRow = Company & { loans: Loan[] };

export const companyColumns: Column<CompanyRow>[] = [
  {
    id: "company",
    header: "Company",
    accessor: (row) => (
      <div>
        <Link
          href={`/dashboard/companies/${row.id}`}
          className="text-sm font-medium text-navy-700 hover:text-navy-600"
        >
          {row.name}
        </Link>
        <div className="text-sm text-gray-500">{row.location}</div>
      </div>
    ),
  },
  {
    id: "industry",
    header: "Industry",
    accessor: (row) => {
      const color = getIndustryColor(row.industry);
      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color.bg} ${color.text}`}>
          {row.industry}
        </span>
      );
    },
  },
  {
    id: "size",
    header: "Size",
    accessor: (row) => <div className="text-sm text-gray-900">{row.size}</div>,
  },
  {
    id: "loans",
    header: "Loans",
    accessor: (row) => {
      const totalAmount = row.loans.reduce((sum, loan) => sum + loan.amount, 0);
      return (
        <div>
          <div className="text-sm text-gray-900">{row.loans.length} loans</div>
          <div className="text-sm text-gray-500">
            {formatCurrency(totalAmount)} total
          </div>
        </div>
      );
    },
  },
];
