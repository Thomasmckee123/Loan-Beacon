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
  Filter,
} from "@/app/components/Table";
import { StatCard } from "@/app/components/StatCard";

export default function CompaniesPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: companiesLoading } =
    useCompanies();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const loading = companiesLoading || loansLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  const industries = ["All", ...new Set(companiesData.map((c) => c.industry))];
  const sizes = ["All", ...new Set(companiesData.map((c) => c.size))];
  const locations = ["All", ...new Set(companiesData.map((c) => c.location))];

  const filteredCompanies: CompanyRow[] = companiesData
    .filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry =
        industryFilter === "All" || company.industry === industryFilter;
      const matchesSize = sizeFilter === "All" || company.size === sizeFilter;
      const matchesLocation =
        locationFilter === "All" || company.location === locationFilter;
      return matchesSearch && matchesIndustry && matchesSize && matchesLocation;
    })
    .map((company) => ({
      ...company,
      loans: loansData.filter((loan) => loan.companyId === company.id),
    }));

  const filters: Filter[] = [
    {
      id: "industry",
      label: "Industry",
      value: industryFilter,
      onChange: setIndustryFilter,
      options: industries,
    },
    {
      id: "size",
      label: "Size",
      value: sizeFilter,
      onChange: setSizeFilter,
      options: sizes,
    },
    {
      id: "location",
      label: "Location",
      value: locationFilter,
      onChange: setLocationFilter,
      options: locations,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard value={filteredCompanies.length} label="Total Companies" />
        <StatCard
          value={filteredCompanies.reduce((sum, c) => sum + c.loans.length, 0)}
          label="Total Loans"
        />
        <StatCard
          value={new Set(filteredCompanies.map((c) => c.industry)).size}
          label="Industries"
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-2">
        <div className="flex-1 min-w-0">
          <TableHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
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
