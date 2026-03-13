import { Button } from "@/app/components/Buttons";
import { TableHeader } from "@/app/components/Table";
import Link from "next/link";
import { FilterAction } from "../utils";
interface TableProps {
  searchTerm: string;
  statusFilter: string;
  loanTypeFilter: string;
  showAdvanced: boolean;
  hasAdvancedFilters: boolean;
  dispatch: React.Dispatch<FilterAction>;
  statuses: string[];
  loanTypes: string[];
}

export const Table = ({
  searchTerm,
  statusFilter,
  loanTypeFilter,
  showAdvanced,
  hasAdvancedFilters,
  dispatch,
  statuses,
  loanTypes,
}: TableProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-2">
      <div className="flex-1 min-w-0">
        <TableHeader
          searchTerm={searchTerm}
          setSearchTerm={(v) => dispatch({ type: "SET_SEARCH", payload: v })}
          searchPlaceholder="Search by company, lender, or loan type..."
          filters={[
            {
              id: "status",
              label: "Status",
              value: statusFilter,
              onChange: (v) => dispatch({ type: "SET_STATUS", payload: v }),
              options: statuses,
            },
            {
              id: "loanType",
              label: "Loan Type",
              value: loanTypeFilter,
              onChange: (v) => dispatch({ type: "SET_LOAN_TYPE", payload: v }),
              options: loanTypes,
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={() => dispatch({ type: "TOGGLE_ADVANCED" })}
          className={`px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
            showAdvanced || hasAdvancedFilters
              ? "bg-navy-800 text-white border-navy-800"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          {showAdvanced ? "Hide Filters" : "More Filters"}
        </Button>
        <Link
          href="/dashboard/loans/new"
          className="bg-navy-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-navy-900 transition-all duration-200"
        >
          + Add Loans
        </Link>
      </div>
    </div>
  );
};
