'use client';

import { useState } from 'react';
import { companies, loans } from '@/data/dummyData';
import { formatCurrency, formatDate, calculateDaysUntilMaturity } from '@/lib/utils';
import Link from 'next/link';

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Active', 'Upcoming', 'Maturing Soon', 'Matured'];

  const filteredLoans = loans.filter(loan => {
    const company = companies.find(c => c.id === loan.companyId);
    const matchesSearch = company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Maturing Soon': return 'bg-orange-100 text-orange-800';
      case 'Matured': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalLoanValue = filteredLoans.reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600">Monitor loan portfolios and maturity dates</p>
        </div>
        <Link
          href="/dashboard/loans/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Loan
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{filteredLoans.length}</p>
            <p className="text-sm text-gray-500">Total Loans</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLoanValue)}</p>
            <p className="text-sm text-gray-500">Total Value</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {filteredLoans.filter(l => l.status === 'Maturing Soon').length}
            </p>
            <p className="text-sm text-gray-500">Maturing Soon</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {filteredLoans.filter(l => l.status === 'Active').length}
            </p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Loans
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by company, lender, or loan type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loans table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Maturity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLoans.map((loan) => {
              const company = companies.find(c => c.id === loan.companyId);
              const daysUntilMaturity = calculateDaysUntilMaturity(loan.maturityDate);

              return (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Link
                        href={`/dashboard/companies/${company?.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        {company?.name}
                      </Link>
                      <div className="text-sm text-gray-500">{company?.industry}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{loan.type}</div>
                      <div className="text-sm text-gray-500">{loan.lender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(loan.amount)}</div>
                    <div className="text-sm text-gray-500">{loan.interestRate}% rate</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(loan.maturityDate)}</div>
                    <div className={`text-sm ${daysUntilMaturity < 30 ? 'text-red-600' : 'text-gray-500'}`}>
                      {daysUntilMaturity > 0 ? `${daysUntilMaturity} days` : 'Overdue'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/companies/${company?.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredLoans.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No loans found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}