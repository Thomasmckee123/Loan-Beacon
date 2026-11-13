"use client";

import { useReducer } from "react";
import { useCompanies, useLoans } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Table, TableHeader, loanColumns } from "@/app/components/Table";
import { Stats } from "@/app/components/StatCards";
import Link from "next/link";
import LoadingSpinner from "@/app/components/loadingSpinner";
import {
  filterReducer,
  initialFilterState,
  statuses,
  filterLoans,
  containerVariants,
  itemVariants,
  statusBorderColors,
} from "./utils";
import { Button } from "@/app/components/Buttons";
import Loan from "./components/Loan";

export default function LoansPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: companiesLoading } =
    useCompanies();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  const loading = companiesLoading || loansLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  const {
    searchTerm,
    statusFilter,
    loanTypeFilter,
    maturityFrom,
    maturityTo,
    amountMin,
    amountMax,
    showAdvanced,
  } = filters;

  const loanTypes = ["All", ...new Set(loansData.map((l) => l.loanType))];

  const filteredLoans = filterLoans(loansData, companiesData, filters);

  const totalLoanValue = filteredLoans.reduce(
    (sum, loan) => sum + loan.amount,
    0,
  );

  const hasAdvancedFilters = !!(
    maturityFrom ||
    maturityTo ||
    amountMin ||
    amountMax
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Stats
        stats={[
          { value: filteredLoans.length, label: "Total Loans" },
          { value: formatCurrency(totalLoanValue), label: "Total Value" },
          {
            value: filteredLoans.filter(
              (l) => l.computedStatus === "Maturing Soon",
            ).length,
            label: "Maturing Soon",
          },
          {
            value: filteredLoans.filter((l) => l.computedStatus === "Active")
              .length,
            label: "Active",
          },
        ]}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <div className="flex-1 min-w-0">
            <TableHeader
              searchTerm={searchTerm}
              setSearchTerm={(v) =>
                dispatch({ type: "SET_SEARCH", payload: v })
              }
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
                  onChange: (v) =>
                    dispatch({ type: "SET_LOAN_TYPE", payload: v }),
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

        {showAdvanced && (
          <Loan
            filters={filters}
            dispatch={dispatch}
            hasAdvancedFilters={hasAdvancedFilters}
          />
        )}
      </div>
      <Table
        columns={loanColumns}
        data={filteredLoans}
        rowKey={(row) => row.id}
        onRowClick={(row) =>
          router.push(`/dashboard/companies/${row.companyId}`)
        }
        emptyMessage="No loans found matching your criteria."
        getRowBorderColor={(row) =>
          statusBorderColors[row.computedStatus] ?? "border-l-gray-300"
        }
      />
    </motion.div>
  );
}
