import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { itemVariants } from "../utils/utils";
import { Alert, Loan } from "@/lib/supabase/types";

const LoanAlert = ({
  key,
  alert,
  loan,
}: {
  key: string;
  alert: Alert;
  loan?: Loan;
}) => {
  return (
    <motion.div
      key={key}
      className={`bg-white border-l-4 ${
        alert.sentSuccessfully ? "border-l-green-500" : "border-l-red-500"
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
            {alert.sentAt ? formatDate(new Date(alert.sentAt)) : "Not sent"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Created {formatDate(new Date(alert.createdAt))}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoanAlert;
