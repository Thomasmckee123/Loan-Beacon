import { companies, loans } from '@/data/dummyData';
import { formatCurrency, formatDate, calculateDaysUntilMaturity } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = companies.find(c => c.id === params.id);
  
  if (!company) {
    notFound();
  }

  const companyLoans = loans.filter(loan => loan.companyId === company.id);
  const totalLoanAmount = companyLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoanCount = companyLoans.filter(loan => loan.status === 'Active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
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
          className="text-blue-600 hover:text-blue-500 flex items-center"
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
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(company.revenue)}</p>
              <p className="text-sm text-gray-500">Annual Revenue</p>
            </div>
          </div>
        </div>

        {/* Company stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{company.employees}</p>
              <p className="text-sm text-gray-500">Employees</p>
            </div>
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
                 className="text-blue-600 hover:text-blue-500">
                {company.website}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-gray-900">{company.notes}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Added</p>
              <p className="text-gray-900">{formatDate(new Date(company.createdAt))}</p>
            </div>
          </div>
        </div>

        {/* Contact information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Primary Contact</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-gray-900">{company.contactInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="text-gray-900">{company.contactInfo.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <a href={`mailto:${company.contactInfo.email}`} 
                 className="text-blue-600 hover:text-blue-500">
                {company.contactInfo.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <a href={`tel:${company.contactInfo.phone}`} 
                 className="text-blue-600 hover:text-blue-500">
                {company.contactInfo.phone}
              </a>
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
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
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
              <thead className="bg-gray-50">
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
                  <tr key={loan.id} className="hover:bg-gray-50">
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
                      <div className="text-sm text-gray-500">
                        {calculateDaysUntilMaturity(loan.maturityDate)} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status}
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