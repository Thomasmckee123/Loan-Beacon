'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import { countryOptions } from '@/lib/countries';

export default function NewCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    website: '',
  });

  const industries = [
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Retail',
    'Energy',
    'Finance',
    'Real Estate',
    'Transportation',
    'Other'
  ];

  const companySizes = [
    'Small',
    'Mid-Market',
    'Large',
    'Enterprise'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const { createCompany } = await import('@/lib/supabase/queries');

      const supabase = createClient();
      await createCompany(supabase, {
        name: formData.name,
        industry: formData.industry,
        size: formData.size,
        location: formData.location,
        website: formData.website,
      });

      router.push('/dashboard/companies');
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Company</h1>
        <p className="text-gray-600">Enter company information to add to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
                />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry *
                </label>
                <select
                  name="industry"
                  id="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Company Size *
                </label>
                <select
                  name="size"
                  id="size"
                  required
                  value={formData.size}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
                >
                  <option value="">Select size</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <Select
                inputId="location"
                options={countryOptions}
                value={countryOptions.find((o) => o.value === formData.location) || null}
                onChange={(option) =>
                  setFormData({ ...formData, location: option?.value || '' })
                }
                placeholder="Select a country..."
                isClearable
                classNames={{
                  control: () => 'mt-1 !border-gray-300 !rounded-md !shadow-sm',
                  menu: () => '!z-50',
                }}
              />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard/companies"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-800 hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Company'}
          </button>
        </div>
      </form>
    </div>
  );
}
