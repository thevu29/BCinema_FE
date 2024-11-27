import { Button, Flex, Group, Menu, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconFilter } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { formatDateForApi } from "../../../../utils/date";

const types = [
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: "to", label: "Between" },
  { value: "=", label: "Equal" },
];

const FilterSchedule = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChangeType = (type) => {
    setSelectedType(type);
  };

  const handleFilterDate = () => {
    if (!selectedType) {
      showNotification("Please select a type", "Error");
      return;
    }
    if (!date) {
      showNotification("Please enter a date", "Error");
      return;
    }

    const params = new URLSearchParams(location.search);

    let dateStr;
    if (selectedType === "=") {
      dateStr = formatDateForApi(date);
    } else if (selectedType === "to") {
      if (!endDate) {
        showNotification("Please enter an end date", "Error");
        return;
      }

      dateStr = `${formatDateForApi(date)}to${formatDateForApi(endDate)}`;
    } else {
      dateStr = `${selectedType}${formatDateForApi(date)}`;
    }

    params.set("date", dateStr);
    params.delete("page");

    if (!dateStr) params.delete("date");

    navigate(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!selectedType) {
      setDate(null);
      setEndDate(null);
    }
  }, [selectedType]);

  const handleReset = () => {
    const params = new URLSearchParams(location.search);
    params.delete("date");
    params.delete("page");

    setSelectedType(null);
    setDate(null);
    setEndDate(null);

    navigate(`${pathname}?${params.toString()}`);
  };

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
        <Flex
          align={selectedType === "to" ? "flex-start" : "center"}
          gap="md"
          direction={selectedType === "to" ? "column" : "row"}
        >
          <Select
            placeholder="Select type"
            data={types}
            allowDeselect
            value={selectedType}
            onChange={handleChangeType}
            maw={150}
          />

          <Group>
            <DateInput
              placeholder="Enter value"
              valueFormat="DD/MM/YYYY"
              disabled={!selectedType}
              value={date}
              onChange={setDate}
            />

            {selectedType === "to" && (
              <>
                <span className="text-sm">To</span>
                <DateInput
                  placeholder="Enter value"
                  valueFormat="DD/MM/YYYY"
                  disabled={!selectedType}
                  value={endDate}
                  onChange={setEndDate}
                />
              </>
            )}
          </Group>

          <Group
            justify={selectedType === "to" && "flex-end"}
            className={selectedType === "to" && "w-full"}
          >
            <Button variant="filled" color="gray" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="filled" onClick={handleFilterDate}>
              Filter
            </Button>
          </Group>
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterSchedule;
