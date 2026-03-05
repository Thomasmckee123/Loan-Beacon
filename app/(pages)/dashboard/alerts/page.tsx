"use client";

import { useState } from "react";
import { useLoans, useAlerts } from "@/hooks";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bell, CheckCircle, XCircle } from "lucide-react";

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

  const sentAlerts = filteredAlerts.filter((a) => a.sentSuccessfully);
  const failedAlerts = filteredAlerts.filter((a) => !a.sentSuccessfully);

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
        <h1 className="text-2xl font-bold text-gray-900">Alert Logs</h1>
        <p className="text-gray-600">
          View notification history for loan maturity alerts
        </p>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-blue-900" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{alertList.length}</p>
              <p className="text-sm text-gray-500">Total Alerts</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="bg-green-50 p-6 rounded-lg shadow-lg border-l-4 border-green-500"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {alertList.filter((a) => a.sentSuccessfully).length}
              </p>
              <p className="text-sm text-green-700">Sent Successfully</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="bg-red-50 p-6 rounded-lg shadow-lg border-l-4 border-red-500"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {alertList.filter((a) => !a.sentSuccessfully).length}
              </p>
              <p className="text-sm text-red-700">Failed</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">
            Filter by Type:
          </label>
          <select
            id="type-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900"
          >
            {alertTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert list */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Alert History ({filteredAlerts.length})
          </h2>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No alert logs found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => {
              const loan = loansData.find((l) => l.id === alert.loanId);

              return (
                <motion.div
                  key={alert.id}
                  className={`px-6 py-4 border-l-4 ${alert.sentSuccessfully ? "border-green-500" : "border-red-500"} hover:bg-gray-50 transition-all duration-200`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${alert.sentSuccessfully ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {alert.sentSuccessfully ? "Sent" : "Failed"}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {alert.alertType}
                        </span>
                      </div>
                      {loan && (
                        <p className="text-sm text-gray-900 mb-1">
                          {loan.loanType} - {loan.lender}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {alert.daysBeforeMaturity} days before maturity
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{alert.sentAt ? formatDate(new Date(alert.sentAt)) : "Not sent"}</p>
                      <p className="text-xs">Created: {formatDate(new Date(alert.createdAt))}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
