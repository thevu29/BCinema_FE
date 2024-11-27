import { Button, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import {
  deleteSeatTypeService,
  getSeatTypesService,
} from "../../../services/seatTypeService";
import { handleSorting } from "../../../utils/sort";
import { showNotification } from "../../../utils/notification";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import SeatTypeTable from "./SeatTypeTable";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Seat Types" },
];

const SeatType = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [seatTypes, setSeatTypes] = useState([]);
  const [selectedSeatTypes, setSelectedSeatTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const fetchSeatTypes = useCallback(
    async (search, price, page, sortBy, sortOrder) => {
      try {
        const res = await getSeatTypesService({
          search,
          price,
          page,
          size,
          sortBy,
          sortOrder,
        });

        if (res.success) {
          setSeatTypes(res);
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
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_order);

    fetchSeatTypes(search, price, page, _sortBy, _order);
  }, [location.search, fetchSeatTypes]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const clearSelectedSeatTypes = () => setSelectedSeatTypes([]);

  const deleteSeatTypes = async () => {
    try {
      setIsLoading(true);
      const res = selectedSeatTypes.map((id) => deleteSeatTypeService(id));
      const responses = await Promise.all(res);

      if (responses.every((res) => res.success)) {
        showNotification("Seat types deleted successfully", "Success");
        clearSelectedSeatTypes();
        await fetchSeatTypes();
      } else {
        showNotification("Some seat types could not be deleted", "Error");
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
      title: <Text size="xl">Delete seat types</Text>,
      children: (
        <>
          <Text size="md">
            Are you sure you want to delete checked seat types?
          </Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete seat types", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteSeatTypes,
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
        Seat Types
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search seat types" />

          <Group>
            {selectedSeatTypes.length > 0 && (
              <Button
                variant="light"
                color="red"
                radius="md"
                onClick={openDeleteModal}
              >
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/seat-types/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create seat type
              </Button>
            </Link>
          </Group>
        </Group>

        <SeatTypeTable
          seatTypes={seatTypes}
          fetchSeatTypes={fetchSeatTypes}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setIsLoading={setIsLoading}
          selectedSeatTypes={selectedSeatTypes}
          setSelectedSeatTypes={setSelectedSeatTypes}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default SeatType;
