import {
  Table,
  Checkbox,
  Avatar,
  Group,
  ActionIcon,
  Text,
  Transition,
  NumberInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash, IconChevronUp } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteUserService } from "../../../services/userService";
import { showNotification } from "../../../utils/notification";
import clsx from "clsx";
import PaginationComponent from "../../Pagination/Pagination";
import FilterUser from "./Filter/FilterUser";

const UserTable = ({
  users,
  fetchUsers,
  sortBy,
  sortOrder,
  setIsLoading,
  selectedUsers,
  setSelectedUsers,
  handleSort,
  size,
  setSize,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = (userIds) => {
    setSelectedUsers((prev) => (prev.length === userIds.length ? [] : userIds));
  };

  const deleteUser = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteUserService(id);

      if (res.success) {
        showNotification(res.message, "Success");
        fetchUsers();
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
      title: <Text size="xl">Delete user</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete this user?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete user", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteUser(id),
    });

  const rows =
    users &&
    users.data &&
    users.data.length > 0 &&
    users.data.map((user) => (
      <Table.Tr
        key={user.id}
        bg={
          selectedUsers.includes(user.id)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedUsers.includes(user.id)}
            onChange={() => toggleUserSelection(user.id)}
          />
        </Table.Td>
        <Table.Td>
          <Avatar size="sm" src={user.avatar} alt="User Image" />
        </Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.point}</Table.Td>
        <Table.Td>
          <span
            className={clsx(
              "py-1 px-[6px] flex justify-center items-center max-w-16",
              {
                "bg-red-600 text-white": user.role === "Admin",
                "bg-green-600 text-white": user.role === "Employee",
                "bg-blue-600 text-white": user.role === "User",
              }
            )}
          >
            {user.role}
          </span>
        </Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/users/${user.id}/update`}>
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
              onClick={() => openDeleteModal(user.id)}
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
                  users && users.data && users.data.length > 0
                    ? selectedUsers.length === users.data.length
                    : false
                }
                onChange={() =>
                  toggleAllUsers(users.data.map((user) => user.id))
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
              onClick={() => handleSort("email")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Email</span>
                <Transition
                  mounted={sortBy === "email"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "email" && (
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
              onClick={() => handleSort("point")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Point</span>
                <Transition
                  mounted={sortBy === "point"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "point" && (
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
            <Table.Th>
              <Group>
                <span>Role</span>
                <FilterUser />
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {users && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{users.take}</strong> of{" "}
              <strong>{users.totalElements}</strong> entries
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
          totalPages={users?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default UserTable;
