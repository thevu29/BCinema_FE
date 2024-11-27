import {
  Table,
  Checkbox,
  Group,
  ActionIcon,
  Text,
  LoadingOverlay,
  Transition,
} from "@mantine/core";
import {
  IconChevronUp,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  getFoodsService,
  deleteFoodService,
} from "../../../services/foodService";
import { showNotification } from "../../../utils/notification";
const ITEMS_PER_PAGE = 4;

import PaginationComponent from "../../Pagination/Pagination";

import { handleSorting } from "../../../utils/sort";

import { modals } from "@mantine/modals";

const FoodTable = ({selectedRows, setSelectedRows}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [foods, setFoods] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchFoods = async (search, page, sortBy, sortOrder) => {
    try {
      const res = await getFoodsService({
        search,
        page,
        size: ITEMS_PER_PAGE,
        sortBy,
        sortOrder,
      });
      if (res.success) {
        setFoods(res);
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
    const _sortOrder = params.get("sortOrder") || "asc";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchFoods(search, page, _sortBy, _sortOrder);
  }, [location.search]);

  const deleteFood = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteFoodService(id);

      if (res.success) {
        showNotification(res.message, "Success"); 
        fetchFoods();
      }
      else{
        showNotification(res.message, "Error");
      }
    }
    catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) => 
    modals.openConfirmModal({
      title: <Text size="xl">Delete Food</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete this food?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete food", cancel: "Cancel" },
      comfirmProps: { color: "red" },
      onConfirm: () => deleteFood(id),
    });

  const rows = foods && foods.data && foods.data.length > 0 && foods.data.map((food) => (
    <Table.Tr
        key={food.id}
        bg={
          selectedRows.includes(food.id)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(food.id)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, food.id]
                  : selectedRows.filter((position) => position !== food.id)
              )
            }
          />
        </Table.Td>
        <Table.Td>{food.name}</Table.Td>
        <Table.Td>{food.price}</Table.Td>
        <Table.Td>{food.quantity}</Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/foods/${food.id}/update`}>
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
              onClick={() => openDeleteModal(food.id)}
            >
              <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
  ));

  const handleSort = (field) => {
    let newSortOrder = "asc";
    if (sortBy === field) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newSortOrder);
    handleSorting(field, newSortOrder, location, pathname, navigate);
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
            <Table.Th>
              <Checkbox
                checked={
                  foods ? selectedRows.length === foods?.data.length : false
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? foods.data.map((user) => user.id)
                      : []
                  )
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
              <Group justify="space-between">
                <span>Price ($)</span>
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
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("quantity")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Quantity</span>
                <Transition
                  mounted={sortBy === "quantity"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "quantity" && (
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
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {foods && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{foods.take}</strong> of{" "}
            <strong>{foods.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={foods?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default FoodTable;
