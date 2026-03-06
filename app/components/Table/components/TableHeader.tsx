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
  searchLabel = "Search",
  filters,
}: TableHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1">
        <Input>
          <Input.Text
            id="search"
            placeholder={searchPlaceholder}
            label={searchLabel}
            className="bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Input>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className="flex-1">
          <Input>
            <Input.Select
              id={filter.id}
              label={filter.label}
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
