"use client";

import { useState } from "react";
import { useCompanies, useLoans } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  loanColumns,
  LoanRow,
} from "@/app/components/Table";
import { StatCard } from "@/app/components/StatCard";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

const statusBorderColors: Record<string, string> = {
  Active: "border-l-green-500",
  Upcoming: "border-l-navy-500",
  "Maturing Soon": "border-l-orange-500",
  Matured: "border-l-red-500",
};

export default function LoansPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: companiesLoading } =
    useCompanies();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loanTypeFilter, setLoanTypeFilter] = useState("All");
  const [maturityFrom, setMaturityFrom] = useState("");
  const [maturityTo, setMaturityTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const loading = companiesLoading || loansLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  const statuses = ["All", "Active", "Upcoming", "Maturing Soon", "Matured"];
  const loanTypes = ["All", ...new Set(loansData.map((l) => l.loanType))];

  // Pre-parse filter values once, outside the filter
  const maturityFromDate = maturityFrom ? new Date(maturityFrom) : null;
  const maturityToDate = maturityTo ? new Date(maturityTo) : null;
  const minAmount = amountMin ? parseFloat(amountMin) : null;
  const maxAmount = amountMax ? parseFloat(amountMax) : null;
  const searchLower = searchTerm.toLowerCase();

  // Build a company lookup map once instead of find() on every loan
  const companyMap = new Map(companiesData.map((c) => [c.id, c]));

  const filteredLoans: LoanRow[] = loansData.reduce<LoanRow[]>((acc, loan) => {
    const company = companyMap.get(loan.companyId); // O(1) instead of O(n)

    const matchesSearch =
      company?.name.toLowerCase().includes(searchLower) ||
      loan.lender.toLowerCase().includes(searchLower) ||
      loan.loanType.toLowerCase().includes(searchLower);

    const maturity = new Date(loan.maturityDate);

    if (
      matchesSearch &&
      (statusFilter === "All" || loan.computedStatus === statusFilter) &&
      (loanTypeFilter === "All" || loan.loanType === loanTypeFilter) &&
      (!maturityFromDate || maturity >= maturityFromDate) &&
      (!maturityToDate || maturity <= maturityToDate) &&
      (!minAmount || loan.amount >= minAmount) &&
      (!maxAmount || loan.amount <= maxAmount)
    ) {
      acc.push({
        ...loan,
        companyName: company?.name,
        companyIndustry: company?.industry,
      });
    }

    return acc;
  }, []);
  const totalLoanValue = filteredLoans.reduce(
    (sum, loan) => sum + loan.amount,
    0,
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          value={filteredLoans.length}
          label="Total Loans"
          variants={itemVariants}
        />
        <StatCard
          value={formatCurrency(totalLoanValue)}
          label="Total Value"
          variants={itemVariants}
        />
        <StatCard
          value={
            filteredLoans.filter((l) => l.computedStatus === "Maturing Soon")
              .length
          }
          label="Maturing Soon"
          variants={itemVariants}
        />
        <StatCard
          value={
            filteredLoans.filter((l) => l.computedStatus === "Active").length
          }
          label="Active"
          variants={itemVariants}
        />
      </motion.div>
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <div className="flex-1 min-w-0">
            <TableHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchPlaceholder="Search by company, lender, or loan type..."
              filters={[
                {
                  id: "status",
                  label: "Status",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: statuses,
                },
                {
                  id: "loanType",
                  label: "Loan Type",
                  value: loanTypeFilter,
                  onChange: setLoanTypeFilter,
                  options: loanTypes,
                },
              ]}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className={`px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                showAdvanced ||
                maturityFrom ||
                maturityTo ||
                amountMin ||
                amountMax
                  ? "bg-navy-800 text-white border-navy-800"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {showAdvanced ? "Hide Filters" : "More Filters"}
            </button>
            <Link
              href="/dashboard/loans/new"
              className="bg-navy-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-navy-900 transition-all duration-200"
            >
              + Add Loans
            </Link>
          </div>
        </div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Maturity Date Range
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={maturityFrom}
                    onChange={(e) => setMaturityFrom(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-400">to</span>
                  <input
                    type="date"
                    value={maturityTo}
                    onChange={(e) => setMaturityTo(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Loan Amount Range
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={amountMin}
                    onChange={(e) => setAmountMin(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-400">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={amountMax}
                    onChange={(e) => setAmountMax(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            {(maturityFrom || maturityTo || amountMin || amountMax) && (
              <button
                onClick={() => {
                  setMaturityFrom("");
                  setMaturityTo("");
                  setAmountMin("");
                  setAmountMax("");
                }}
                className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Clear advanced filters
              </button>
            )}
          </motion.div>
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
