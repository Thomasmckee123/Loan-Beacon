"use client";

import { useReducer } from "react";
import { useCompanies, useLoans } from "@/hooks";
import Link from "next/link";
import LoadingSpinner from "@/app/components/loadingSpinner";
import { useRouter } from "next/navigation";
import { Table, TableHeader, companyColumns } from "@/app/components/Table";
import { Stats } from "@/app/components/StatCards";
import {
  companyFilterReducer,
  initialCompanyFilterState,
  filterCompanies,
  getCompanyFilters,
} from "./utils";

export default function CompaniesPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: companiesLoading } =
    useCompanies();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [state, dispatch] = useReducer(
    companyFilterReducer,
    initialCompanyFilterState,
  );
  const loading = companiesLoading || loansLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  const industries = ["All", ...new Set(companiesData.map((c) => c.industry))];
  const sizes = ["All", ...new Set(companiesData.map((c) => c.size))];
  const locations = ["All", ...new Set(companiesData.map((c) => c.location))];

  const filteredCompanies = filterCompanies(companiesData, loansData, state);
  const filters = getCompanyFilters(state, dispatch, {
    industries,
    sizes,
    locations,
  });

  return (
    <div className="space-y-6">
      <Stats
        stats={[
          { value: filteredCompanies.length, label: "Total Companies" },
          {
            value: filteredCompanies.reduce(
              (sum, c) => sum + c.loans.length,
              0,
            ),
            label: "Total Loans",
          },
          {
            value: new Set(filteredCompanies.map((c) => c.industry)).size,
            label: "Industries",
          },
        ]}
      />
      <div className="flex flex-col md:flex-row md:items-end gap-2">
        <div className="flex-1 min-w-0">
          <TableHeader
            searchTerm={state.searchTerm}
            setSearchTerm={(v) => dispatch({ type: "SET_SEARCH", payload: v })}
            searchPlaceholder="Search by name or location..."
            filters={filters}
          />
        </div>
        <Link
          href="/dashboard/companies/new"
          className="shrink-0 bg-navy-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-navy-900 transition-all duration-200"
        >
          + Add Company
        </Link>
      </div>
      <Table
        columns={companyColumns}
        data={filteredCompanies}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/dashboard/companies/${row.id}`)}
        emptyMessage="No companies found matching your criteria."
      />
    </div>
  );
}
