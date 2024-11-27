import { Button, Group, Menu, Select, TextInput } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const types = [
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: "=", label: "Equal" },
];

const FilterSeatType = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const [price, setPrice] = useState(null);

  const handleChangeType = (type) => {
    setSelectedType(type);
  };

  const handleFilterPrice = useCallback(
    (price) => {
        setPrice(price);

      const params = new URLSearchParams(location.search);

      const priceStr = price
        ? selectedType && selectedType !== "="
          ? `${selectedType}${price}`
          : price
        : null;

      params.set("price", priceStr);
      params.delete("page");

      if (!priceStr) params.delete("price");

      navigate(`${pathname}?${params.toString()}`);
    },
    [location.search, navigate, pathname, selectedType]
  );

  useEffect(() => {
    selectedType ? handleFilterPrice(price) : handleFilterPrice(null);
  }, [price, selectedType, handleFilterPrice]);

  return (
    <Menu shadow="md" closeOnClickOutside={false}>
      <Menu.Target>
        <Button
          variant="white"
          color="rgba(0, 0, 0, 1)"
          size="xs"
          onClick={(e) => e.stopPropagation()}
        >
          <IconFilter width={18} height={18} />
        </Button>
      </Menu.Target>

      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        <Group>
          <Select
            placeholder="Select type"
            data={types}
            allowDeselect
            value={selectedType}
            onChange={handleChangeType}
            maw={150}
          />

          <TextInput
            type="number"
            placeholder="Enter value"
            disabled={!selectedType}
            value={price || ""}
            onChange={(e) => handleFilterPrice(e.target.value)}
          />
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterSeatType;
