import { Loan, Company } from "@/lib/supabase/types";
import { LoanRow } from "@/app/components/Table";

export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  loanTypeFilter: string;
  maturityFrom: string;
  maturityTo: string;
  amountMin: string;
  amountMax: string;
  showAdvanced: boolean;
}

export type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_LOAN_TYPE"; payload: string }
  | { type: "SET_MATURITY_FROM"; payload: string }
  | { type: "SET_MATURITY_TO"; payload: string }
  | { type: "SET_AMOUNT_MIN"; payload: string }
  | { type: "SET_AMOUNT_MAX"; payload: string }
  | { type: "TOGGLE_ADVANCED" }
  | { type: "CLEAR_ADVANCED" };

export const initialFilterState: FilterState = {
  searchTerm: "",
  statusFilter: "All",
  loanTypeFilter: "All",
  maturityFrom: "",
  maturityTo: "",
  amountMin: "",
  amountMax: "",
  showAdvanced: false,
};

export function filterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_STATUS":
      return { ...state, statusFilter: action.payload };
    case "SET_LOAN_TYPE":
      return { ...state, loanTypeFilter: action.payload };
    case "SET_MATURITY_FROM":
      return { ...state, maturityFrom: action.payload };
    case "SET_MATURITY_TO":
      return { ...state, maturityTo: action.payload };
    case "SET_AMOUNT_MIN":
      return { ...state, amountMin: action.payload };
    case "SET_AMOUNT_MAX":
      return { ...state, amountMax: action.payload };
    case "TOGGLE_ADVANCED":
      return { ...state, showAdvanced: !state.showAdvanced };
    case "CLEAR_ADVANCED":
      return {
        ...state,
        maturityFrom: "",
        maturityTo: "",
        amountMin: "",
        amountMax: "",
      };
    default:
      return state;
  }
}

export const statuses = [
  "All",
  "Active",
  "Upcoming",
  "Maturing Soon",
  "Matured",
];

export function filterLoans(
  loans: Loan[],
  companies: Company[],
  filters: FilterState,
): LoanRow[] {
  const {
    searchTerm,
    statusFilter,
    loanTypeFilter,
    maturityFrom,
    maturityTo,
    amountMin,
    amountMax,
  } = filters;

  const maturityFromDate = maturityFrom ? new Date(maturityFrom) : null;
  const maturityToDate = maturityTo ? new Date(maturityTo) : null;
  const minAmount = amountMin ? parseFloat(amountMin) : null;
  const maxAmount = amountMax ? parseFloat(amountMax) : null;
  const searchLower = searchTerm.toLowerCase();
  const companyMap = new Map(companies.map((c) => [c.id, c]));

  return loans.reduce<LoanRow[]>((acc, loan) => {
    const company = companyMap.get(loan.companyId);

    const matchesSearch =
      company?.name.toLowerCase().includes(searchLower) ||
      loan.lender.toLowerCase().includes(searchLower) ||
      loan.loanType.toLowerCase().includes(searchLower);

    const maturity = new Date(loan.maturityDate);

    if (
      matchesSearch &&
      (statusFilter === "All" || loan.computedStatus === statusFilter) &&
      (loanTypeFilter === "All" || loan.loanType === loanTypeFilter) &&
      (!maturityFromDate || maturity >= maturityFromDate) &&
      (!maturityToDate || maturity <= maturityToDate) &&
      (!minAmount || loan.amount >= minAmount) &&
      (!maxAmount || loan.amount <= maxAmount)
    ) {
      acc.push({
        ...loan,
        companyName: company?.name,
        companyIndustry: company?.industry,
      });
    }

    return acc;
  }, []);
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

export const statusBorderColors: Record<string, string> = {
  Active: "border-l-green-500",
  Upcoming: "border-l-navy-500",
  "Maturing Soon": "border-l-orange-500",
  Matured: "border-l-red-500",
};
