import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const ConversationSearch = ({ search, setSearch, filteredResults }) => {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      />

      <InputGroupAddon>
        <Search />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">{search && filteredResults.length + ' results'}</InputGroupAddon>
    </InputGroup>
  );
};

export default ConversationSearch;
