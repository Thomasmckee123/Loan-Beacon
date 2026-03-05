import { Input } from "../../InputField/components/Input";

interface TableHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  filterValue: string;
  setFilterValue: (value: string) => void;
  filterOptions: string[];
  filterLabel?: string;
}

const TableHeader = ({
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search...",
  searchLabel = "Search",
  filterValue,
  setFilterValue,
  filterOptions,
  filterLabel = "Filter",
}: TableHeaderProps) => {
  return (
    <div className="bg-white px-10 rounded-4xl shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pb-5">
          <Input>
            <Input.Text
              id="search"
              placeholder={searchPlaceholder}
              label={searchLabel}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Input>
        </div>
        <div className="pb-5">
          <Input>
            <Input.Select
              id="filter"
              label={filterLabel}
              value={filterValue}
              options={filterOptions}
              onChange={(value) => setFilterValue(value)}
            />
          </Input>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
