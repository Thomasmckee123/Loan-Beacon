import { Input } from "../../InputField/components/Input";
interface TableHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  industryFilter: string;
  setIndustryFilter: (value: string) => void;
  industries: string[];
}
const TableSettings = ({
  searchTerm,
  setSearchTerm,
  industryFilter,
  setIndustryFilter,
  industries,
}: TableHeaderProps) => {
  return (
    <div className="bg-white px-10 rounded-full shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pb-5">
          <Input>
            <Input.Text
              id="search"
              placeholder="Search by name or location..."
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Input>
        </div>
        <div className="pb-5">
          <Input>
            <Input.Select
              id="industry"
              label="Filter by Industry"
              value={industryFilter}
              options={industries}
              onChange={(value) => setIndustryFilter(value)}
            />
          </Input>
        </div>
      </div>
    </div>
  );
};

export default TableSettings;
