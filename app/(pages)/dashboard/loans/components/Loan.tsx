import { motion } from "framer-motion";
import { FilterAction, FilterState } from "../utils";
import { Button } from "@/app/components/Buttons";

interface LoanProps {
  filters: Pick<FilterState, "maturityFrom" | "maturityTo" | "amountMin" | "amountMax">;
  dispatch: React.Dispatch<FilterAction>;
  hasAdvancedFilters: boolean;
}

const Loan = ({ filters, dispatch, hasAdvancedFilters }: LoanProps) => {
  const { maturityFrom, maturityTo, amountMin, amountMax } = filters;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Maturity Date Range
          </p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={maturityFrom}
              onChange={(e) =>
                dispatch({
                  type: "SET_MATURITY_FROM",
                  payload: e.target.value,
                })
              }
              className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={maturityTo}
              onChange={(e) =>
                dispatch({
                  type: "SET_MATURITY_TO",
                  payload: e.target.value,
                })
              }
              className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Loan Amount Range
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={amountMin}
              onChange={(e) =>
                dispatch({
                  type: "SET_AMOUNT_MIN",
                  payload: e.target.value,
                })
              }
              className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="number"
              placeholder="Max"
              value={amountMax}
              onChange={(e) =>
                dispatch({
                  type: "SET_AMOUNT_MAX",
                  payload: e.target.value,
                })
              }
              className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      {hasAdvancedFilters && (
        <Button
          onClick={() => dispatch({ type: "CLEAR_ADVANCED" })}
          className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Clear advanced filters
        </Button>
      )}
    </motion.div>
  );
};

export default Loan;
