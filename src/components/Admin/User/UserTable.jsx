import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Avatar,
  Group,
  ActionIcon,
  Text,
  LoadingOverlay,
  Transition,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash, IconChevronUp } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  deleteUserService,
  getUsersService,
} from "../../../services/userService";
import { showNotification } from "../../../utils/notication";
import clsx from "clsx";
import PaginationComponent from "../../Pagination/Pagination";
import { handleSorting } from "../../../utils/sort";
import FilterUser from "./Filter/FilterUser";

const ITEMS_PER_PAGE = 4;

const UserTable = ({ selectedRows, setSelectedRows }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [users, setUsers] = useState({ results: [], meta: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const fetchUsers = async (search, role, page, sortBy, order) => {
    try {
      const res = await getUsersService({
        search,
        role,
        page,
        size: ITEMS_PER_PAGE,
        sortBy,
        order,
      });

      if (res.success) {
        const data = { results: res.data, meta: res.meta };
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const role = params.get("role") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchUsers(search, role, page, _sortBy, _order);
  }, [location.search]);

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
    users.results &&
    users.results.length > 0 &&
    users.results.map((user) => (
      <Table.Tr
        key={user.userId}
        bg={
          selectedRows.includes(user.userId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(user.userId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, user.userId]
                  : selectedRows.filter((position) => position !== user.userId)
              )
            }
          />
        </Table.Td>
        <Table.Td>
          {user.image ? (
            <Avatar size="sm" src={user.image} alt="User Image" />
          ) : (
            <Avatar size="sm" />
          )}
        </Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.phone}</Table.Td>
        <Table.Td>
          <span
            className={clsx(
              "py-1 px-[6px] flex justify-center items-center max-w-16",
              {
                "bg-red-600 text-white": user.role === "Admin",
                "bg-green-600 text-white": user.role === "Doctor",
                "bg-blue-600 text-white": user.role === "User",
              }
            )}
          >
            {user.role}
          </span>
        </Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/users/${user.userId}/update`}>
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
              onClick={() => openDeleteModal(user.userId)}
            >
              <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setOrder(newOrder);
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
            <Table.Th>
              <Checkbox
                checked={
                  users.results.length <= 0
                    ? false
                    : selectedRows.length === users.results.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? users.results.map((user) => user.userId)
                      : []
                  )
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
                            order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
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
                            order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
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
              onClick={() => handleSort("phone")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Phone</span>
                <Transition
                  mounted={sortBy === "phone"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "phone" && (
                      <IconChevronUp
                        style={{
                          transform:
                            order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
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
              <Group justify="space-between">
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
        {users && users.meta && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{users.meta.take}</strong> of{" "}
            <strong>{users.meta.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={users?.meta?.totalPage || 1}
        />
      </Group>
    </>
  );
};

export default UserTable;
