import { Button, Group, Menu, Select, TextInput } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const types = [
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: "=", label: "Equal" },
];

const FilterFoodQuantity = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const [quantity, setQuantity] = useState(null);

  const handleChangeType = (type) => {
    setSelectedType(type);
  };

  const handleFilterQuantity = useCallback(
    (quantity) => {
      setQuantity(quantity);

      const params = new URLSearchParams(location.search);
      const currentPage = params.get("page");

      const quantityStr = quantity
        ? selectedType && selectedType !== "="
          ? `${selectedType}${quantity}`
          : quantity
        : null;

      if (quantityStr) {
        params.set("quantity", quantityStr);
      } else {
        params.delete("quantity");
      }

      if (currentPage) {
        params.set("page", currentPage);
      }

      navigate(`${pathname}?${params.toString()}`);
    },
    [location.search, navigate, pathname, selectedType]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasOnlyPageChange =
      Array.from(params.keys()).length === 1 && params.has("page");

    if (hasOnlyPageChange) {
      return;
    }

    if (!selectedType) {
      handleFilterQuantity(null);
    } else if (quantity !== null) {
      handleFilterQuantity(quantity);
    }
  }, [quantity, selectedType, handleFilterQuantity, location.search]);

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
            value={quantity || ""}
            onChange={(e) => handleFilterQuantity(e.target.value)}
          />
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterFoodQuantity;
