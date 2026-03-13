import { Company, Loan } from "@/lib/supabase/types";
import { CompanyRow } from "@/app/components/Table";
import { Filter } from "@/app/components/Table";

export interface CompanyFilterState {
  searchTerm: string;
  industryFilter: string;
  sizeFilter: string;
  locationFilter: string;
}

export type CompanyFilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_INDUSTRY"; payload: string }
  | { type: "SET_SIZE"; payload: string }
  | { type: "SET_LOCATION"; payload: string };

export const initialCompanyFilterState: CompanyFilterState = {
  searchTerm: "",
  industryFilter: "All",
  sizeFilter: "All",
  locationFilter: "All",
};

export function companyFilterReducer(
  state: CompanyFilterState,
  action: CompanyFilterAction,
): CompanyFilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_INDUSTRY":
      return { ...state, industryFilter: action.payload };
    case "SET_SIZE":
      return { ...state, sizeFilter: action.payload };
    case "SET_LOCATION":
      return { ...state, locationFilter: action.payload };
    default:
      return state;
  }
}

export function filterCompanies(
  companies: Company[],
  loans: Loan[],
  state: CompanyFilterState,
): CompanyRow[] {
  const { searchTerm, industryFilter, sizeFilter, locationFilter } = state;

  return companies
    .filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry =
        industryFilter === "All" || company.industry === industryFilter;
      const matchesSize = sizeFilter === "All" || company.size === sizeFilter;
      const matchesLocation =
        locationFilter === "All" || company.location === locationFilter;
      return matchesSearch && matchesIndustry && matchesSize && matchesLocation;
    })
    .map((company) => ({
      ...company,
      loans: loans.filter((loan) => loan.companyId === company.id),
    }));
}

export function getCompanyFilters(
  state: CompanyFilterState,
  dispatch: React.Dispatch<CompanyFilterAction>,
  options: { industries: string[]; sizes: string[]; locations: string[] },
): Filter[] {
  return [
    {
      id: "industry",
      label: "Industry",
      value: state.industryFilter,
      onChange: (v) => dispatch({ type: "SET_INDUSTRY", payload: v }),
      options: options.industries,
    },
    {
      id: "size",
      label: "Size",
      value: state.sizeFilter,
      onChange: (v) => dispatch({ type: "SET_SIZE", payload: v }),
      options: options.sizes,
    },
    {
      id: "location",
      label: "Location",
      value: state.locationFilter,
      onChange: (v) => dispatch({ type: "SET_LOCATION", payload: v }),
      options: options.locations,
    },
  ];
}
