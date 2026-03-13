import { motion } from "framer-motion";
import { filter } from "framer-motion/client";
import { Bell } from "lucide-react";
import { containerVariants } from "../utils/utils";
import LoanAlert from "./LoanAlert";
import { Alert, Loan } from "@/lib/supabase/types";

const AlertHistory = ({
  filteredAlerts,
  loansData,
}: {
  filteredAlerts: Alert[];
  loansData: Loan[];
}) => {
  return (
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
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredAlerts.map((alert) => {
            const loan = loansData.find((l) => l.id === alert.loanId);

            return <LoanAlert key={alert.id} alert={alert} loan={loan} />;
          })}
        </motion.div>
      )}
    </div>
  );
};

export default AlertHistory;
