'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanies, useCreateLoan } from '@/hooks';
import { useSnackbar } from '@/app/components/Snackbar';
import Link from 'next/link';
import { Button } from '@/app/components/Buttons';

export default function NewLoanPage() {
  const router = useRouter();
  const { data: companiesData = [], isPending: loading } = useCompanies();
  const createLoanMutation = useCreateLoan();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    companyId: '',
    loanType: '',
    amount: '',
    currency: 'USD',
    lender: '',
    originationDate: '',
    maturityDate: '',
    interestRate: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createLoanMutation.mutate(
      {
        companyId: formData.companyId,
        loanType: formData.loanType,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        lender: formData.lender,
        originationDate: formData.originationDate,
        maturityDate: formData.maturityDate,
        interestRate: parseFloat(formData.interestRate),
        notes: formData.notes,
      },
      {
        onSuccess: () => {
          showSnackbar('Loan created successfully!');
          router.push('/dashboard/loans');
        },
        onError: (error) => {
          console.error('Error creating loan:', error);
          showSnackbar('Failed to create loan. Please try again.', 'error');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/loans"
          className="text-navy-700 hover:text-navy-600 flex items-center"
        >
          ← Back to Loans
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Loan</h1>
        <p className="text-gray-600">Enter loan details to track maturity dates and refinancing opportunities</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
        </div>
      ) : (
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
                >
                  <option value="">Select company</option>
                  {companiesData.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name} ({company.industry})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
                  Loan Type *
                </label>
                <select
                  name="loanType"
                  id="loanType"
                  required
                  value={formData.loanType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
                />
              </div>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
              />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="cancel" href="/dashboard/loans">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createLoanMutation.isPending}
            loadingText="Adding..."
          >
            Add Loan
          </Button>
        </div>
      </form>
      )}
    </div>
  );
}