"use client";

import { useState } from "react";
import { useLoans, useAlerts } from "@/hooks";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "@/app/components/StatCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

export default function AlertsPage() {
  const { data: alertList = [], isPending: alertsLoading } = useAlerts();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [filter, setFilter] = useState("All");
  const loading = alertsLoading || loansLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  const alertTypes = ["All", ...new Set(alertList.map((a) => a.alertType))];

  const filteredAlerts = alertList.filter((alert) => {
    if (filter === "All") return true;
    return alert.alertType === filter;
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Summary stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          value={alertList.length}
          label="Total Alerts"
          icon={<Bell className="w-6 h-6 text-white" />}
          variants={itemVariants}
        />
        <StatCard
          value={alertList.filter((a) => a.sentSuccessfully).length}
          label="Sent Successfully"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500"
          valueClassName="text-green-600"
          labelClassName="text-green-700"
          variants={itemVariants}
        />
        <StatCard
          value={alertList.filter((a) => !a.sentSuccessfully).length}
          label="Failed"
          icon={<XCircle className="w-6 h-6 text-white" />}
          className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500"
          valueClassName="text-red-600"
          labelClassName="text-red-700"
          variants={itemVariants}
        />
      </motion.div>

      <div className="flex flex-wrap items-center gap-2">
        {alertTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer duration-200 ${
              filter === type
                ? "bg-navy-800 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Alert History
          </h2>
          <span className="text-sm text-gray-400">
            {filteredAlerts.length}{" "}
            {filteredAlerts.length === 1 ? "alert" : "alerts"}
          </span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-12 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No alert logs found.</p>
          </div>
        ) : (
          <motion.div
            key={filter}
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAlerts.map((alert) => {
              const loan = loansData.find((l) => l.id === alert.loanId);

              return (
                <motion.div
                  key={alert.id}
                  className={`bg-white border-l-4 ${
                    alert.sentSuccessfully
                      ? "border-l-green-500"
                      : "border-l-red-500"
                  } rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200`}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                            alert.sentSuccessfully
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {alert.sentSuccessfully ? "Sent" : "Failed"}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                          {alert.alertType}
                        </span>
                      </div>
                      {loan && (
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {loan.loanType} &middot; {loan.lender}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {alert.daysBeforeMaturity} days before maturity
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.sentAt
                          ? formatDate(new Date(alert.sentAt))
                          : "Not sent"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created {formatDate(new Date(alert.createdAt))}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
