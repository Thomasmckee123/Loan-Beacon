import { Input } from "../../InputField/components/Input";

export interface Filter {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

interface TableHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  filters: Filter[];
}

const TableHeader = ({
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search...",
  filters,
}: TableHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2">
      <div className="flex-1 min-w-0">
        <Input className="">
          <Input.Text
            id="search"
            placeholder={searchPlaceholder}
            className="bg-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Input>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className="md:w-44 shrink-0">
          <Input className="">
            <Input.Select
              id={filter.id}
              placeholder={filter.label}
              value={filter.value}
              options={filter.options}
              onChange={(value) => filter.onChange(value)}
            />
          </Input>
        </div>
      ))}
    </div>
  );
};

export default TableHeader;
