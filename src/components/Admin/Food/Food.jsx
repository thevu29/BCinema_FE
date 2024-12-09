import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { Button, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  deleteFoodService,
  getFoodsService,
} from "../../../services/foodService";
import { handleSorting } from "../../../utils/sort";
import { showNotification } from "../../../utils/notification";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import FoodTable from "./FoodTable";
import Search from "../Search/Search";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Foods", href: "/admin/foods" },
];

const Food = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [foods, setFoods] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [size, setSize] = useState(4);

  const fetchFoods = useCallback(
    async (search, price, quantity, page, sortBy, sortOrder) => {
      try {
        const res = await getFoodsService({
          search,
          price,
          quantity,
          page,
          size,
          sortBy,
          sortOrder,
        });
        if (res.success) {
          setFoods(res);
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
    const price = params.get("price") || "";
    const quantity = params.get("quantity") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _sortOrder = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchFoods(search, price, quantity, page, _sortBy, _sortOrder);
  }, [location.search, fetchFoods]);

  const handleSort = (field) => {
    let newSortOrder = "asc";
    if (sortBy === field) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newSortOrder);
    handleSorting(field, newSortOrder, location, pathname, navigate);
  };

  const clearSelectedFoods = () => setSelectedFoods([]);

  const deleteFoods = async () => {
    try {
      setIsLoading(true);

      const deleteFoodsRes = selectedFoods.map((id) => deleteFoodService(id));
      const res = await Promise.all(deleteFoodsRes);

      if (res.every((response) => response.success)) {
        showNotification("Foods deleted successfully", "Success");
        clearSelectedFoods();
        await fetchFoods();
      } else {
        showNotification("Some foods could not be deleted", "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occured", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete foods</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete checked foods?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete foods", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteFoods,
    });

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Foods
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search foods" />

          <Group>
            {selectedFoods.length > 0 && (
              <Button
                variant="light"
                color="red"
                radius="md"
                onClick={openDeleteModal}
              >
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/foods/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create food
              </Button>
            </Link>
          </Group>
        </Group>

        <FoodTable
          foods={foods}
          fetchFoods={fetchFoods}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setIsLoading={setIsLoading}
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default Food;
