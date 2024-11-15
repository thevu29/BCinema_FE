import { useEffect, useState } from "react";
import {
  Table,
  Group,
  ActionIcon,
  LoadingOverlay,
  Transition,
} from "@mantine/core";
import { IconEdit, IconChevronUp } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getSchedulesService,
} from "../../../services/scheduleService";
import { handleSorting } from "../../../utils/sort";
import PaginationComponent from "../../Pagination/Pagination";

const ITEMS_PER_PAGE = 4;

const ScheduleTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchSchedules = async (search, date, movieId, roomId, status, page, sortBy, sortOrder) => {
    try {
      const res = await getSchedulesService({
        search,
        date,
        movieId,
        roomId,
        status,
        page,
        size: ITEMS_PER_PAGE,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setSchedules(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const date = params.get("date") || "";
    const movieId = params.get("movieId") || "";
    const roomId = params.get("roomId") || "";
    const status = params.get("status") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _sortOrder = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchSchedules(search, date, movieId, roomId, status, page, _sortBy, _sortOrder);
  }, [location.search]);

  const rows =
    schedules &&
    schedules.data &&
    schedules.data.length > 0 &&
    schedules.data.map((schedule) => (
      schedule.schedules.map((subSchedule) => (
        <Table.Tr
          key={subSchedule.id}
        >
          <Table.Td>{schedule.date}</Table.Td>
          <Table.Td>{schedule.movieName}</Table.Td>
          <Table.Td>{schedule.roomName}</Table.Td>
          <Table.Td>{subSchedule.time}</Table.Td>
          <Table.Td>{schedule.runtime}</Table.Td>
          <Table.Td>{subSchedule.status}</Table.Td>
          <Table.Td>
            <Group gap={6}>
              <Link to={`/admin/schedules/${subSchedule.id}/update`}>
                <ActionIcon
                  variant="transparent"
                  color="yellow"
                  radius="xl"
                  title="Update"
                >
                  <IconEdit
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Link>
            </Group>
          </Table.Td>
        </Table.Tr>
      ))
    ));

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              onClick={() => handleSort("date")}
              className="cursor-pointer hover:bg-slate-50"
            >
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
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("movieName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Movie</span>
                <Transition
                  mounted={sortBy === "movieName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "movieName" && (
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
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("roomName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Room</span>
                <Transition
                  mounted={sortBy === "roomName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "roomName" && (
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
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("time")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Time</span>
                <Transition
                  mounted={sortBy === "time"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "time" && (
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
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("runtime")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Run time</span>
                <Transition
                  mounted={sortBy === "runtime"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "runtime" && (
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
            </Table.Th>
            <Table.Th
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Status</span>
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {schedules && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{schedules.take}</strong> of{" "}
            <strong>{schedules.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={schedules?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default ScheduleTable;