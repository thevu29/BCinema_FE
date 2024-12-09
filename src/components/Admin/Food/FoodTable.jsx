import {
  Table,
  Checkbox,
  Group,
  ActionIcon,
  Text,
  Transition,
  Avatar,
  NumberInput,
} from "@mantine/core";
import { IconChevronUp, IconEdit, IconTrash } from "@tabler/icons-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { deleteFoodService } from "../../../services/foodService";
import { showNotification } from "../../../utils/notification";
import { modals } from "@mantine/modals";
import PaginationComponent from "../../Pagination/Pagination";
import FilterFoodPrice from "./Filter/FilterFoodPrice";
import FilterFoodQuantity from "./Filter/FilterFoodQuantity";

const FoodTable = ({
  foods,
  fetchFoods,
  sortBy,
  sortOrder,
  setIsLoading,
  selectedFoods,
  setSelectedFoods,
  handleSort,
  size,
  setSize,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const toggleFoodSelection = (foodId) => {
    setSelectedFoods((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );
  };

  const toggleAllFoods = (foodIds) => {
    setSelectedFoods((prev) => (prev.length === foodIds.length ? [] : foodIds));
  };

  const deleteFood = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteFoodService(id);

      if (res.success) {
        showNotification(res.message, "Success");
        fetchFoods();
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
      confirmProps: { color: "red" },
      onConfirm: () => deleteFood(id),
    });

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const rows =
    foods &&
    foods.data &&
    foods.data.length > 0 &&
    foods.data.map((food) => (
      <Table.Tr
        key={food.id}
        bg={
          selectedFoods.includes(food.id)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedFoods.includes(food.id)}
            onChange={() => toggleFoodSelection(food.id)}
          />
        </Table.Td>
        <Table.Td>
          <Avatar size="sm" src={food.image} alt="User Image" />
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

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={
                  foods && foods.data && foods.data.length > 0
                    ? selectedFoods.length === foods.data.length
                    : false
                }
                onChange={() =>
                  toggleAllFoods(foods.data.map((food) => food.id))
                }
              />
            </Table.Th>
            <Table.Th />
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
                  <span>Price (VND)</span>
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

                <FilterFoodPrice />
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("quantity")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
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

                <FilterFoodQuantity />
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {foods && (
            <span className="text-sm italic text-gray-700 dark:text-gray-400">
              Showing <strong>{foods.take}</strong> of{" "}
              <strong>{foods.totalElements}</strong> entries
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
          totalPages={foods?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default FoodTable;
