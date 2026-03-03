"use client";

import { formatCurrency, calculateDaysUntilMaturity } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getCompanies, getLoans, getAlerts } from "@/lib/supabase/queries";
import { Company, Loan, Alert } from "@/lib/supabase/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Building2, Banknote, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

// Animated counter component
function AnimatedCounter({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const [companiesData, loansData, alertsData] = await Promise.all([
          getCompanies(supabase),
          getLoans(supabase),
          getAlerts(supabase),
        ]);
        setCompanies(companiesData);
        setLoans(loansData);
        setAlerts(alertsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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

  // Calculate stats
  const totalCompanies = companies.length;
  const activeLoans = loans.filter((loan) => loan.computedStatus === "Active").length;
  const upcomingLoans = loans.filter((loan) => {
    const days = calculateDaysUntilMaturity(loan.maturityDate);
    return days <= 180 && days > 0;
  }).length;
  const totalLoanValue = loans.reduce((sum, loan) => sum + loan.amount, 0);

  // Get recent alerts
  const urgentAlerts = alerts.slice(0, 3);

  // Get recent companies (last 3)
  const recentCompanies = companies
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Track loan maturities and refinancing opportunities
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer"
          variants={cardVariants}
          onClick={() => {
            router.push("/dashboard/companies");
          }}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="size-12 bg-blue-900 rounded-md flex items-center justify-center">
                <Building2 className="size-6 text-amber-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-900">
                Total Companies
              </p>
              <p className="text-2xl font-bold text-blue-900">
                <AnimatedCounter value={totalCompanies} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer"
          variants={cardVariants}
          onClick={() => {
            router.push("/dashboard/loans");
          }}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-900 rounded-md flex items-center justify-center">
                <Banknote className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-900">Active Loans</p>
              <p className="text-2xl font-bold text-blue-900">
                <AnimatedCounter value={activeLoans} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer border-l-4 border-amber-400"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          onClick={() => {
            router.push("/dashboard/loans?filter=upcoming");
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-900 rounded-md flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-900">
                Upcoming (6 months)
              </p>
              <p className="text-2xl font-bold text-blue-900">
                <AnimatedCounter value={upcomingLoans} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
          onClick={() => {
            router.push("/dashboard/loans");
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-900 rounded-md flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-900">
                Total Loan Value
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(totalLoanValue)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        {/* Urgent alerts */}
        <motion.div
          className="bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-blue-900">
                Urgent Alerts
              </h2>
              <Link
                href="/dashboard/alerts"
                className="text-sm text-blue-700 hover:text-blue-600 transition-colors duration-200"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {urgentAlerts.length === 0 ? (
              <p className="text-gray-500">No urgent alerts</p>
            ) : (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {urgentAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      className="border-l-4 border-amber-400 pl-4 hover:bg-amber-50 p-3 rounded-r-lg transition-all duration-200 cursor-pointer"
                      variants={cardVariants}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${alert.sentSuccessfully ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                              {alert.alertType}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {alert.daysBeforeMaturity} days before maturity
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {alert.sentAt ? new Date(alert.sentAt).toLocaleDateString() : 'Not sent'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Recent companies */}
        <motion.div
          className="bg-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-blue-900">
                Recent Companies
              </h2>
              <Link
                href="/dashboard/companies"
                className="text-sm text-blue-700 hover:text-blue-600 transition-colors duration-200"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {recentCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer"
                  variants={cardVariants}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <Link
                      href={`/dashboard/companies/${company.id}`}
                      className="text-sm font-medium text-blue-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      {company.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {company.industry} • {company.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-900">
                      {company.size}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
