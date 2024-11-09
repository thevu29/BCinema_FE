import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

const Search = ({ placeholder }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const handleSearch = useDebouncedCallback((search) => {
    const params = new URLSearchParams(location.search);

    params.set("search", search);
    params.delete("page");

    if (!search) params.delete("search");

    navigate(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextInput
      leftSectionPointerEvents="none"
      leftSection={<IconSearch width={18} height={18} />}
      onChange={e => handleSearch(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default Search;
