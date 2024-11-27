import { Link, useLocation, useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import {
  ActionIcon,
  Checkbox,
  Group,
  NumberInput,
  Table,
  Text,
  Transition,
} from "@mantine/core";
import { IconChevronUp, IconEdit, IconTrash } from "@tabler/icons-react";
import { showNotification } from "../../../utils/notification";
import { deleteSeatTypeService } from "../../../services/seatTypeService";
import PaginationComponent from "../../Pagination/Pagination";
import FilterSeatType from "./Filter/FilterSeatType";

const SeatTypeTable = ({
  seatTypes,
  fetchSeatTypes,
  sortBy,
  sortOrder,
  setIsLoading,
  selectedSeatTypes,
  setSelectedSeatTypes,
  handleSort,
  size,
  setSize,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSeatTypeSelection = (seatTypeId) => {
    setSelectedSeatTypes((prev) =>
      prev.includes(seatTypeId)
        ? prev.filter((id) => id !== seatTypeId)
        : [...prev, seatTypeId]
    );
  };

  const toggleAllSeatTypes = (seatTypeIds) => {
    setSelectedSeatTypes((prev) =>
      prev.length === seatTypeIds.length ? [] : seatTypeIds
    );
  };

  const deleteSeatType = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteSeatTypeService(id);

      if (res.success) {
        showNotification(res.message, "Success");
        fetchSeatTypes();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete seat type</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete this seat type?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete seat type", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteSeatType(id),
    });

  const rows =
    seatTypes &&
    seatTypes.data &&
    seatTypes.data.length > 0 &&
    seatTypes.data.map((seatType) => (
      <Table.Tr
        key={seatType.id}
        bg={
          selectedSeatTypes.includes(seatType.id)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedSeatTypes.includes(seatType.id)}
            onChange={() => toggleSeatTypeSelection(seatType.id)}
          />
        </Table.Td>
        <Table.Td>{seatType.name}</Table.Td>
        <Table.Td>{seatType.price}</Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/seat-types/${seatType.id}/update`}>
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

            <ActionIcon
              variant="transparent"
              color="red"
              radius="xl"
              title="Delete"
              onClick={() => openDeleteModal(seatType.id)}
            >
              <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Group>
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
            <Table.Th>
              <Checkbox
                checked={
                  seatTypes && seatTypes.data && seatTypes.data.length > 0
                    ? selectedSeatTypes.length === seatTypes.data.length
                    : false
                }
                onChange={() =>
                  toggleAllSeatTypes(seatTypes.data.map((user) => user.id))
                }
              />
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("name")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Name</span>
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
              onClick={() => handleSort("price")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Price</span>
                  <Transition
                    mounted={sortBy === "price"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "price" && (
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

                <FilterSeatType />
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {seatTypes && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{seatTypes.take}</strong> of{" "}
              <strong>{seatTypes.totalElements}</strong> entries
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
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={seatTypes?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default SeatTypeTable;
