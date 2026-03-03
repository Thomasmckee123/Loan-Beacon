'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Landmark, Mail, Lock, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Success - show confirmation message
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-navy-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-navy-700 to-navy-900">
              <Landmark className="w-7 h-7 text-gold-400" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-navy-900">LoanBeacon</h2>
          <p className="mt-2 text-sm text-navy-600">Create your account</p>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-navy-100">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
            >
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="mb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-navy-900 mb-2">Account created successfully!</h3>
              <p className="text-sm text-navy-600 mb-6">
                Check your email to confirm your account and get started.
              </p>
              <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-800 hover:bg-navy-900 transition-colors duration-200">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label htmlFor="firstName" className="flex items-center text-sm font-medium text-navy-700 mb-1">
                  <User className="w-4 h-4 mr-2 text-gold-500" />
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-navy-200 rounded-md placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent sm:text-sm transition-all duration-200"
                    placeholder="John"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <label htmlFor="lastName" className="flex items-center text-sm font-medium text-navy-700 mb-1">
                  <User className="w-4 h-4 mr-2 text-gold-500" />
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-navy-200 rounded-md placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent sm:text-sm transition-all duration-200"
                    placeholder="Doe"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label htmlFor="email" className="flex items-center text-sm font-medium text-navy-700 mb-1">
                <Mail className="w-4 h-4 mr-2 text-gold-500" />
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-navy-200 rounded-md placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <label htmlFor="password" className="flex items-center text-sm font-medium text-navy-700 mb-1">
                <Lock className="w-4 h-4 mr-2 text-gold-500" />
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-navy-200 rounded-md placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <label htmlFor="confirmPassword" className="flex items-center text-sm font-medium text-navy-700 mb-1">
                <Lock className="w-4 h-4 mr-2 text-gold-500" />
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-navy-200 rounded-md placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-navy-800 hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </motion.button>
            </motion.div>
          </form>
          )}

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="text-center">
              <span className="text-sm text-navy-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-navy-700 hover:text-gold-600 transition-colors duration-200">
                  Sign in
                </Link>
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}