"use client";

import { useState } from "react";
import { useLoans, useAlerts } from "@/hooks";
import { motion } from "framer-motion";
import LoadingSpinner from "@/app/components/loadingSpinner";
import { Button } from "@/app/components/Buttons";
import { AlertHeader } from "./components";
import AlertHistory from "./components/AlertHistory";

export default function AlertsPage() {
  const { data: alertList = [], isPending: alertsLoading } = useAlerts();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [filter, setFilter] = useState("All");
  const loading = alertsLoading || loansLoading;

  if (loading) {
    return <LoadingSpinner />;
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
      <AlertHeader alertList={alertList} />
      <div className="flex flex-wrap items-center gap-2">
        {alertTypes.map((type) => (
          <Button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer duration-200 ${
              filter === type
                ? "bg-navy-800 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {type}
          </Button>
        ))}
      </div>
      <AlertHistory filteredAlerts={filteredAlerts} loansData={loansData} />
    </motion.div>
  );
}
