"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Landmark, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error or message in URL params
    const errorParam = searchParams.get("error");
    const messageParam = searchParams.get("message");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else if (messageParam) {
      setSuccessMessage(decodeURIComponent(messageParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign in",
      );
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
          <p className="mt-2 text-sm text-navy-600">Sign in to your account</p>
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

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md"
            >
              <p className="text-sm text-green-800">{successMessage}</p>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium text-navy-700 mb-1"
              >
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-navy-200 rounded-md placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label
                htmlFor="password"
                className="flex items-center text-sm font-medium text-navy-700 mb-1"
              >
                <Lock className="w-4 h-4 mr-2 text-gold-500" />
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-navy-200 rounded-md placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-navy-800 hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="text-center">
              <span className="text-sm text-navy-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-navy-700 hover:text-gold-600 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
