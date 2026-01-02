'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { companies } from '@/data/dummyData';
import Link from 'next/link';

export default function NewLoanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyId: '',
    type: '',
    amount: '',
    currency: 'USD',
    lender: '',
    originationDate: '',
    maturityDate: '',
    interestRate: '',
    covenants: '',
    notes: ''
  });

  const loanTypes = [
    'Term Loan',
    'Revolving Credit',
    'Equipment Financing',
    'Project Finance',
    'Bridge Loan',
    'Mezzanine Debt',
    'Working Capital',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to database
    alert('Loan would be saved (demo mode)');
    router.push('/dashboard/loans');
  };

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/loans"
          className="text-blue-600 hover:text-blue-500 flex items-center"
        >
          ← Back to Loans
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Loan</h1>
        <p className="text-gray-600">Enter loan details to track maturity dates and refinancing opportunities</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Basic Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
                  Company *
                </label>
                <select
                  name="companyId"
                  id="companyId"
                  required
                  value={formData.companyId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name} ({company.industry})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Loan Type *
                </label>
                <select
                  name="type"
                  id="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select loan type</option>
                  {loanTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Loan Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  placeholder="50000000"
                  value={formData.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  name="currency"
                  id="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="lender" className="block text-sm font-medium text-gray-700">
                Lender *
              </label>
              <input
                type="text"
                name="lender"
                id="lender"
                required
                placeholder="First National Bank"
                value={formData.lender}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Loan Terms */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Loan Terms</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="originationDate" className="block text-sm font-medium text-gray-700">
                  Origination Date *
                </label>
                <input
                  type="date"
                  name="originationDate"
                  id="originationDate"
                  required
                  value={formData.originationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="maturityDate" className="block text-sm font-medium text-gray-700">
                  Maturity Date *
                </label>
                <input
                  type="date"
                  name="maturityDate"
                  id="maturityDate"
                  required
                  value={formData.maturityDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                  Interest Rate (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="interestRate"
                  id="interestRate"
                  required
                  placeholder="5.25"
                  value={formData.interestRate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="covenants" className="block text-sm font-medium text-gray-700">
                Covenants
              </label>
              <input
                type="text"
                name="covenants"
                id="covenants"
                placeholder="Debt-to-EBITDA < 3.0x, Min DSCR 1.25x"
                value={formData.covenants}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Additional Information</h2>
          </div>
          <div className="px-6 py-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={4}
                placeholder="Additional notes about the loan purpose, special terms, etc..."
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard/loans"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Loan
          </button>
        </div>
      </form>
    </div>
  );
}