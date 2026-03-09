"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  formatCurrency,
  formatDate,
  calculateDaysUntilMaturity,
} from "@/lib/utils";
import { Loan, Company } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";
interface TimelineCardProps {
  loan: Loan;
  company?: Company;
  variants?: Variants;
}

function getStatusStyles(status: string) {
  switch (status) {
    case "Maturing Soon":
      return {
        border: "border-l-amber-500",
        badge: "bg-amber-100 text-amber-800",
        glow: "hover:shadow-amber-100",
      };
    case "Matured":
      return {
        border: "border-l-red-500",
        badge: "bg-red-100 text-red-800",
        glow: "hover:shadow-red-100",
      };
    case "Upcoming":
      return {
        border: "border-l-blue-500",
        badge: "bg-blue-100 text-blue-800",
        glow: "hover:shadow-blue-100",
      };
    default:
      return {
        border: "border-l-emerald-500",
        badge: "bg-emerald-100 text-emerald-800",
        glow: "hover:shadow-emerald-100",
      };
  }
}

const TimelineCard = ({ loan, company, variants }: TimelineCardProps) => {
  const router = useRouter();
  const styles = getStatusStyles(loan.computedStatus);
  const daysUntil = calculateDaysUntilMaturity(loan.maturityDate);

  return (
    <motion.div
      className={`bg-white border-l-4 ${styles.border} rounded-xl p-5 hover:cursor-pointer shadow-sm hover:shadow-lg ${styles.glow} transition-all duration-300`}
      variants={variants}
      onClick={() => router.push(`/dashboard/companies/${company?.id}`)}
      whileHover={{ x: 6 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href={`/dashboard/companies/${company?.id}`}
              className="font-semibold text-gray-900 hover:text-blue-900 transition-colors truncate"
            >
              {company?.name}
            </Link>
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${styles.badge}`}
            >
              {loan.computedStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Type
              </p>
              <p className="text-sm font-medium text-gray-800">
                {loan.loanType}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Lender
              </p>
              <p className="text-sm font-medium text-gray-800">{loan.lender}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Amount
              </p>
              <p className="text-sm font-medium text-gray-800">
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Rate
              </p>
              <p className="text-sm font-medium text-gray-800">
                {loan.interestRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-gray-900">
            {formatDate(loan.maturityDate)}
          </p>
          <p
            className={`text-xs font-medium mt-1 ${
              daysUntil <= 0
                ? "text-red-600"
                : daysUntil <= 30
                  ? "text-amber-600"
                  : "text-gray-500"
            }`}
          >
            {daysUntil <= 0
              ? `${Math.abs(daysUntil)}d overdue`
              : `${daysUntil}d remaining`}
          </p>
          {loan.notes && (
            <p className="text-xs text-gray-400 mt-1.5 max-w-32 text-right truncate">
              {loan.notes}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
