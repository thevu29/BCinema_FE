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
  getRoomsService,
} from "../../../services/roomService";
import { handleSorting } from "../../../utils/sort";
import PaginationComponent from "../../Pagination/Pagination";

const ITEMS_PER_PAGE = 4;

const RoomTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [rooms, setRooms] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchRooms = async (search, page, sortBy, sortOrder) => {
    try {
      const res = await getRoomsService({
        search,
        page,
        size: ITEMS_PER_PAGE,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setRooms(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _sortOrder = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchRooms(search, page, _sortBy, _sortOrder);
  }, [location.search]);

  const rows =
    rooms &&
    rooms.data &&
    rooms.data.length > 0 &&
    rooms.data.map((room) => (
      <Table.Tr
        key={room.id}
      >
        <Table.Td>{room.name}</Table.Td>
        <Table.Td>{room.description}</Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/rooms/${room.id}/update`}>
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
              onClick={() => handleSort("name")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Room Name</span>
                <Transition
                  mounted={sortBy === "name"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "name" && (
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
                <span>Description</span>
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {rooms && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{rooms.take}</strong> of{" "}
            <strong>{rooms.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={rooms?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default RoomTable;