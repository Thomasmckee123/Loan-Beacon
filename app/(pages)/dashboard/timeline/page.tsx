"use client";

import { useState } from "react";
import { useCompanies, useLoans } from "@/hooks";
import { Company, Loan } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Stats } from "@/app/components/StatCards";
import { TimelineCard } from "@/app/components/TimelineCard";
import LoadingSpinner from "@/app/components/loadingSpinner";

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

// Calendar component
function Calendar({
  loans,
  companies: companiesData,
}: {
  loans: Loan[];
  companies: Company[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get loans for this month
  const monthLoans = loans.filter((loan: Loan) => {
    const maturityDate = new Date(loan.maturityDate);
    return (
      maturityDate.getMonth() === currentDate.getMonth() &&
      maturityDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group loans by day
  const loansByDay = monthLoans.reduce(
    (acc: Record<number, Loan[]>, loan: Loan) => {
      const day = new Date(loan.maturityDate).getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(loan);
      return acc;
    },
    {} as Record<number, Loan[]>,
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Maturing Soon":
        return "bg-amber-100 border-amber-300";
      case "Matured":
        return "bg-red-200 border-red-400";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => navigateMonth("prev")}
            className="p-2 text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => navigateMonth("next")}
            className="p-2 text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="h-24 border border-gray-100"
          ></div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayLoans = loansByDay[day] || [];
          const isToday =
            new Date().toDateString() ===
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day,
            ).toDateString();

          return (
            <motion.div
              key={day}
              className={`h-24 border border-gray-200 p-1 ${isToday ? "bg-amber-50 border-amber-300" : "hover:bg-gray-50"} transition-colors duration-200`}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className={`text-sm font-medium mb-1 ${isToday ? "text-amber-600" : "text-gray-900"}`}
              >
                {day}
              </div>
              <div className="space-y-1">
                {dayLoans.slice(0, 2).map((loan: Loan) => {
                  const company = companiesData.find(
                    (c) => c.id === loan.companyId,
                  );
                  return (
                    <motion.div
                      key={loan.id}
                      className={`text-xs p-1 rounded border ${getStatusColor(loan.computedStatus)} cursor-pointer`}
                      whileHover={{ scale: 1.05 }}
                      title={`${company?.name} - ${loan.loanType} - ${formatCurrency(loan.amount)}`}
                    >
                      <div className="truncate">{company?.name}</div>
                    </motion.div>
                  );
                })}
                {dayLoans.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayLoans.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
          <span>Maturing Soon</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
          <span>Matured</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Active/Upcoming</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TimelinePage() {
  const { data: companiesData = [], isPending: companiesLoading } =
    useCompanies();
  const { data: loansData = [], isPending: loansLoading } = useLoans();
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline");
  const loading = companiesLoading || loansLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  // Group loans by maturity year and month
  const groupedLoans = loansData.reduce(
    (acc, loan) => {
      const maturityDate = new Date(loan.maturityDate);
      const yearMonth = `${maturityDate.getFullYear()}-${String(maturityDate.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[yearMonth]) {
        acc[yearMonth] = [];
      }
      acc[yearMonth].push(loan);
      return acc;
    },
    {} as Record<string, typeof loansData>,
  );

  // Sort by date
  const sortedPeriods = Object.keys(groupedLoans).sort();

  const getMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-end"
      >
        <div className="flex bg-gray-100 rounded-lg p-1">
          <motion.button
            onClick={() => setViewMode("timeline")}
            className={`px-4 py-2 rounded-md text-sm hover:cursor-pointer font-medium transition-all duration-200 ${
              viewMode === "timeline"
                ? "bg-blue-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📊 Timeline
          </motion.button>
          <motion.button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all hover:cursor-pointer duration-200 ${
              viewMode === "calendar"
                ? "bg-blue-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📅 Calendar
          </motion.button>
        </div>
      </motion.div>
      <Stats
        stats={[
          { value: loansData.length, label: "Total Loans Tracked" },
          {
            value: loansData.filter((l) => l.computedStatus === "Maturing Soon").length,
            label: "Maturing Soon (≤30 days)",
            valueClassName: "text-amber-600",
            labelClassName: "text-amber-700",
            className: "bg-gradient-to-br from-amber-50 to-amber-100 border-l-4 border-amber-400",
          },
          {
            value: loansData.filter((l) => l.computedStatus === "Upcoming").length,
            label: "Upcoming (≤6 months)",
            valueClassName: "text-gray-600",
          },
        ]}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === "timeline" ? (
          <motion.div
            key="timeline"
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {/* Vertical timeline rail */}
            {sortedPeriods.length > 0 && (
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-blue-900 via-blue-400 to-transparent" />
            )}

            <div className="space-y-6">
              {sortedPeriods.map((period, index) => {
                const periodLoans = groupedLoans[period];
                const totalValue = periodLoans.reduce(
                  (sum, loan) => sum + loan.amount,
                  0,
                );

                return (
                  <motion.div
                    key={period}
                    className="relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div className="absolute left-5 -translate-x-1/2 top-5 z-10">
                      <div className="size-10 rounded-full bg-blue-900 flex items-center justify-center shadow-lg ring-4 ring-white">
                        <CalendarIcon className="size-4 text-amber-400" />
                      </div>
                    </div>

                    <div className="ml-16 bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-blue-900">
                          {getMonthName(period)}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {periodLoans.length}{" "}
                            {periodLoans.length === 1 ? "loan" : "loans"}
                          </span>
                          <span className="text-xs font-semibold text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200">
                            {formatCurrency(totalValue)}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        className="divide-y divide-gray-100"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {periodLoans
                          .sort(
                            (a, b) =>
                              new Date(a.maturityDate).getTime() -
                              new Date(b.maturityDate).getTime(),
                          )
                          .map((loan) => {
                            const company = companiesData.find(
                              (c) => c.id === loan.companyId,
                            );
                            return (
                              <TimelineCard
                                key={loan.id}
                                loan={loan}
                                company={company}
                                variants={itemVariants}
                              />
                            );
                          })}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {sortedPeriods.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="size-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No loans to display
                </h3>
                <p className="text-gray-500">
                  Add some loans to see them on the timeline.{" "}
                  <Link
                    href="/dashboard/loans/new"
                    className="text-blue-900 hover:text-blue-700 font-medium transition-colors"
                  >
                    Add your first loan
                  </Link>
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Calendar loans={loansData} companies={companiesData} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
