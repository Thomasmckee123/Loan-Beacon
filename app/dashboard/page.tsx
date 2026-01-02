import { companies, loans, alerts } from '@/data/dummyData';
import { formatCurrency, calculateDaysUntilMaturity } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  // Calculate stats
  const totalCompanies = companies.length;
  const activeLoans = loans.filter(loan => loan.status === 'Active').length;
  const upcomingLoans = loans.filter(loan => {
    const days = calculateDaysUntilMaturity(loan.maturityDate);
    return days <= 180 && days > 0;
  }).length;
  const totalLoanValue = loans.reduce((sum, loan) => sum + loan.amount, 0);

  // Get urgent alerts (not dismissed and high/critical priority)
  const urgentAlerts = alerts
    .filter(alert => !alert.dismissed && (alert.priority === 'High' || alert.priority === 'Critical'))
    .slice(0, 3);

  // Get recent companies (last 3)
  const recentCompanies = companies
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Track loan maturities and refinancing opportunities</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">🏢</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">⏰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming (6 months)</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingLoans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">💵</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Loan Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLoanValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Urgent Alerts</h2>
              <Link
                href="/dashboard/alerts"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {urgentAlerts.length === 0 ? (
              <p className="text-gray-500">No urgent alerts</p>
            ) : (
              <div className="space-y-4">
                {urgentAlerts.map((alert) => {
                  const company = companies.find(c => c.id === alert.companyId);
                  const priorityColors = {
                    Critical: 'bg-red-100 text-red-800',
                    High: 'bg-orange-100 text-orange-800',
                    Medium: 'bg-yellow-100 text-yellow-800',
                    Low: 'bg-green-100 text-green-800',
                  };

                  return (
                    <div key={alert.id} className="border-l-4 border-red-400 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[alert.priority]}`}>
                              {alert.priority}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {company?.name}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {alert.daysUntilMaturity} days remaining
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent companies */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Companies</h2>
              <Link
                href="/dashboard/companies"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/dashboard/companies/${company.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      {company.name}
                    </Link>
                    <p className="text-xs text-gray-500">{company.industry} • {company.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(company.revenue)}
                    </p>
                    <p className="text-xs text-gray-500">{company.employees} employees</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}