import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const ConversationSearch = ({ search, setSearch, filteredResults, label }) => {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput
      type="text"
      placeholder="Search..."
      aria-label={label}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      />

      <InputGroupAddon>
        <Search />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        {search && (
          <span aria-live="polite">
            {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
          </span>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default ConversationSearch;
