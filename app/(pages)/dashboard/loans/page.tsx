"use client";

import { useState } from "react";
import { useCompanies, useLoans } from "@/hooks";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableHeader, loanColumns, LoanRow } from "@/app/components/Table";

export default function LoansPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: companiesLoading } =
    useCompanies();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const loading = companiesLoading || loansLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  const statuses = ["All", "Active", "Upcoming", "Maturing Soon", "Matured"];

  const filteredLoans: LoanRow[] = loansData
    .filter((loan) => {
      const company = companiesData.find((c) => c.id === loan.companyId);
      const matchesSearch =
        company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || loan.computedStatus === statusFilter;
      return matchesSearch && matchesStatus;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600">
            Monitor loan portfolios and maturity dates
          </p>
        </div>
        <Link
          href="/dashboard/loans/new"
          className="bg-navy-800 text-white px-4 py-2 rounded-md hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
        >
          Add Loan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {filteredLoans.length}
            </p>
            <p className="text-sm text-gray-500">Total Loans</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalLoanValue)}
            </p>
            <p className="text-sm text-gray-500">Total Value</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {filteredLoans.filter((l) => l.computedStatus === "Maturing Soon").length}
            </p>
            <p className="text-sm text-gray-500">Maturing Soon</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {filteredLoans.filter((l) => l.computedStatus === "Active").length}
            </p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>
      </div>

      <TableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Search by company, lender, or loan type..."
        searchLabel="Search Loans"
        filterValue={statusFilter}
        setFilterValue={setStatusFilter}
        filterOptions={statuses}
        filterLabel="Filter by Status"
      />

      <Table
        columns={loanColumns}
        data={filteredLoans}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/dashboard/companies/${row.companyId}`)}
        emptyMessage="No loans found matching your criteria."
      />
    </div>
  );
}
