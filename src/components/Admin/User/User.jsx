import { useState, useEffect, useCallback } from "react";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { Button, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import {
  deleteUserService,
  getUsersService,
} from "../../../services/userService";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import UserTable from "./UserTable";
import Search from "../Search/Search";
import { showNotification } from "../../../utils/notification";
import { handleSorting } from "../../../utils/sort";

const breadcumbData = [{ title: "Admin", href: "/admin" }, { title: "Users" }];

const User = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const fetchUsers = useCallback(
    async (search, role, page, sortBy, sortOrder) => {
      try {
        const res = await getUsersService({
          search,
          page,
          role,
          size,
          sortBy,
          sortOrder,
        });

        if (res.success) {
          setUsers(res);
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
    const role = params.get("role") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_order);

    fetchUsers(search, role, page, _sortBy, _order);
  }, [location.search, fetchUsers]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const clearSelectedUsers = () => setSelectedUsers([]);

  const deleteUsers = async () => {
    try {
      setIsLoading(true);
      const deleteUsersRes = selectedUsers.map((id) => deleteUserService(id));
      const res = await Promise.all(deleteUsersRes);

      if (res.every((response) => response.success)) {
        showNotification("Users deleted successfully", "Success");
        clearSelectedUsers();
        await fetchUsers();
      } else {
        showNotification("Some users could not be deleted", "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Error deleting users", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete users</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete checked users?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete users", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteUsers,
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
        Users
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search users" />

          <Group>
            {selectedUsers.length > 0 && (
              <Button
                variant="light"
                color="red"
                radius="md"
                onClick={openDeleteModal}
              >
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/users/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create user
              </Button>
            </Link>
          </Group>
        </Group>

        <UserTable
          users={users}
          fetchUsers={fetchUsers}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setIsLoading={setIsLoading}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default User;
