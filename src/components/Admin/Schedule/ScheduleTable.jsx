import {
  Table,
  Group,
  ActionIcon,
  Transition,
  Text,
  NumberInput,
} from "@mantine/core";
import { IconEye, IconChevronUp } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSchedulesService } from "../../../services/scheduleService";
import { handleSorting } from "../../../utils/sort";
import PaginationComponent from "../../Pagination/Pagination";
import FilterSchedule from "./Filter/FilterSchedule";

const ScheduleTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState(null);
  const [size, setSize] = useState(4);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchSchedules = useCallback(
    async (search, date, roomId, page, sortBy, sortOrder) => {
      try {
        const res = await getSchedulesService({
          search,
          date,
          roomId,
          page,
          size,
          sortBy,
          sortOrder,
        });

        if (res.success) {
          setSchedules(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const date = params.get("date") || "";
    const roomId = params.get("roomId") || "";
    const page = +params.get("page")|| 1;
    const _sortBy = params.get("sortBy") || "";
    const _sortOrder = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchSchedules(search, date, roomId, page, _sortBy, _sortOrder);
  }, [location.search, fetchSchedules]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const rows =
    schedules &&
    schedules.data &&
    schedules.data.length > 0 &&
    schedules.data.map((schedule, index) => (
      <Table.Tr key={index}>
        <Table.Td>{schedule.movieName}</Table.Td>
        <Table.Td>{schedule.roomName}</Table.Td>
        <Table.Td>{new Date(schedule.date).toLocaleDateString()}</Table.Td>
        <Table.Td>{schedule.runtime}</Table.Td>
        <Table.Td>
          <Link to={"/admin/schedules/details"} state={{ schedule }}>
            <ActionIcon
              variant="transparent"
              color="blue"
              radius="xl"
              title="View details"
            >
              <IconEye style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Link>
        </Table.Td>
      </Table.Tr>
    ));

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Movie</Table.Th>
            <Table.Th>Room</Table.Th>
            <Table.Th
              onClick={() => handleSort("date")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Date</span>
                  <Transition
                    mounted={sortBy === "date"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "date" && (
                        <IconChevronUp
                          style={{
                            transform:
                              sortOrder === "asc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                            ...styles,
                          }}
                          width={16}
                          height={16}
                        />
                      )
                    }
                  </Transition>
                </Group>

                <FilterSchedule />
              </Group>
            </Table.Th>
            <Table.Th>Runtime</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {schedules && (
            <span className="text-sm italic text-gray-700 dark:text-gray-400">
              Showing <strong>{schedules.take}</strong> of{" "}
              <strong>{schedules.totalElements}</strong> entries
            </span>
          )}

          <Group gap={4}>
            <Text size="xs" fw={700}>
              Per page:
            </Text>
            <NumberInput
              maw={50}
              size="xs"
              value={size}
              onChange={(e) => handleSizeChange(e)}
            />
          </Group>
        </Group>

        <PaginationComponent
          currentPage={schedules?.page || 1}
          totalPages={schedules?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default ScheduleTable;
