"use client";

import { useState } from "react";
import { useCompanies, useLoans } from "@/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  companyColumns,
  CompanyRow,
} from "@/app/components/Table";

export default function CompaniesPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: companiesLoading } =
    useCompanies();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const loading = companiesLoading || loansLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  const industries = ["All", ...new Set(companiesData.map((c) => c.industry))];

  const filteredCompanies: CompanyRow[] = companiesData
    .filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry =
        industryFilter === "All" || company.industry === industryFilter;
      return matchesSearch && matchesIndustry;
    })
    .map((company) => ({
      ...company,
      loans: loansData.filter((loan) => loan.companyId === company.id),
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">
            Manage your client companies and their loan portfolios
          </p>
        </div>
        <Link
          href="/dashboard/companies/new"
          className="bg-navy-800 text-white px-4 py-2 rounded-md hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
        >
          Add Company
        </Link>
      </div>

      <TableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        industries={industries}
      />

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
