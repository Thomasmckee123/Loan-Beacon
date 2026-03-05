'use client';

import { formatCurrency, formatDate, calculateDaysUntilMaturity } from '@/lib/utils';
import { useCompany, useLoansByCompany } from '@/hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: company, isPending: companyLoading } = useCompany(id);
  const { data: companyLoans = [], isPending: loansLoading } = useLoansByCompany(id);
  const loading = companyLoading || loansLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/companies"
            className="text-navy-700 hover:text-navy-600 flex items-center"
          >
            ← Back to Companies
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Company not found</p>
        </div>
      </div>
    );
  }

  const totalLoanAmount = companyLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoanCount = companyLoans.filter(loan => loan.computedStatus === 'Active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-navy-100 text-navy-800';
      case 'Maturing Soon': return 'bg-orange-100 text-orange-800';
      case 'Matured': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/companies"
          className="text-navy-700 hover:text-navy-600 flex items-center"
        >
          ← Back to Companies
        </Link>
      </div>

      {/* Company header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600">{company.industry} • {company.location}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">{company.size}</p>
              <p className="text-sm text-gray-500">Company Size</p>
            </div>
          </div>
        </div>

        {/* Company stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{companyLoans.length}</p>
              <p className="text-sm text-gray-500">Total Loans</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{activeLoanCount}</p>
              <p className="text-sm text-gray-500">Active Loans</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLoanAmount)}</p>
              <p className="text-sm text-gray-500">Total Debt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Website</p>
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                 className="text-navy-700 hover:text-navy-600">
                {company.website}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Added</p>
              <p className="text-gray-900">{formatDate(new Date(company.createdAt))}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Details</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Size</p>
              <p className="text-gray-900">{company.size}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Industry</p>
              <p className="text-gray-900">{company.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-gray-900">{company.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loans table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Loans</h2>
            <Link
              href="/dashboard/loans/new"
              className="bg-navy-800 text-white px-3 py-1.5 rounded-md text-sm hover:bg-navy-900"
            >
              Add Loan
            </Link>
          </div>
        </div>
        
        {companyLoans.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No loans found for this company.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-navy-50">
                <tr>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companyLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-navy-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loan.loanType}</div>
                        <div className="text-sm text-gray-500">{loan.lender}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(loan.amount)}</div>
                      <div className="text-sm text-gray-500">{loan.interestRate}% rate</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(loan.maturityDate)}</div>
                      <div className="text-sm text-gray-500">
                        {calculateDaysUntilMaturity(loan.maturityDate)} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.computedStatus)}`}>
                        {loan.computedStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}