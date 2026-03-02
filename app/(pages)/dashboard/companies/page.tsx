'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanies, getLoans } from '@/lib/supabase/queries';
import { Company, Loan } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CompaniesPage() {
  const [companiesData, setCompaniesData] = useState<Company[]>([]);
  const [loansData, setLoansData] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const [companies, loans] = await Promise.all([
          getCompanies(supabase),
          getLoans(supabase),
        ]);
        setCompaniesData(companies);
        setLoansData(loans);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  const industries = ['All', ...new Set(companiesData.map(c => c.industry))];

  const filteredCompanies = companiesData.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'All' || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const getCompanyLoans = (companyId: string) => {
    return loansData.filter(loan => loan.companyId === companyId);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">Manage your client companies and their loan portfolios</p>
        </div>
        <Link
          href="/dashboard/companies/new"
          className="bg-navy-800 text-white px-4 py-2 rounded-md hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
        >
          Add Company
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Companies
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Filter by Industry
            </label>
            <select
              id="industry"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-navy-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loans
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCompanies.map((company) => {
              const companyLoans = getCompanyLoans(company.id);
              const totalLoanAmount = companyLoans.reduce((sum, loan) => sum + loan.amount, 0);

              return (
                <tr key={company.id} className="hover:bg-navy-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Link
                        href={`/dashboard/companies/${company.id}`}
                        className="text-sm font-medium text-navy-700 hover:text-navy-600"
                      >
                        {company.name}
                      </Link>
                      <div className="text-sm text-gray-500">{company.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-navy-100 text-navy-800">
                      {company.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(company.revenue)}</div>
                    <div className="text-sm text-gray-500">{company.employees} employees</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{companyLoans.length} loans</div>
                    <div className="text-sm text-gray-500">{formatCurrency(totalLoanAmount)} total</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{company.contactInfo.name}</div>
                    <div className="text-sm text-gray-500">{company.contactInfo.title}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCompanies.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No companies found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}