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
  Filter,
} from "@/app/components/Table";
import { StatCard } from "@/app/components/StatCard";
import { Button } from "@/app/components/Buttons";
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

  const filteredLoans: LoanRow[] = loansData
    .filter((loan) => {
      const company = companiesData.find((c) => c.id === loan.companyId);
      const matchesSearch =
        company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || loan.computedStatus === statusFilter;
      const matchesLoanType =
        loanTypeFilter === "All" || loan.loanType === loanTypeFilter;
      return matchesSearch && matchesStatus && matchesLoanType;
    })
    .map((loan) => {
      const company = companiesData.find((c) => c.id === loan.companyId);
      return {
        ...loan,
        companyName: company?.name,
        companyIndustry: company?.industry,
      };
    });

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
        <Link
          href="/dashboard/loans/new"
          className="shrink-0 bg-navy-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-navy-900 transition-all duration-200"
        >
          + Add Loans
        </Link>
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
