import {
  Table,
  Checkbox,
  Group,
  ActionIcon,
  Transition,
  Text,
  NumberInput,
} from "@mantine/core";
import { IconEdit, IconChevronUp } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";

const RoleTable = ({
  roles,
  sortBy,
  sortOrder,
  selectedRoles,
  setSelectedRoles,
  handleSort,
  size,
  setSize,
}) => {
  const toggleRoleSelection = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const toggleAllRoles = (roleIds) => {
    setSelectedRoles((prev) => (prev.length === roleIds.length ? [] : roleIds));
  };

  const rows =
    roles &&
    roles.data &&
    roles.data.length > 0 &&
    roles.data.map((role) => (
      <Table.Tr
        key={role.id}
        bg={
          selectedRoles.includes(role.id)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRoles.includes(role.id)}
            onChange={() => toggleRoleSelection(role.id)}
          />
        </Table.Td>
        <Table.Td />
        <Table.Td>{role.name}</Table.Td>
        <Table.Td>{role.description}</Table.Td>

        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/roles/${role.id}/update`}>
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

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={
                  roles && roles.data && roles.data.length > 0
                    ? selectedRoles.length === roles.data.length
                    : false
                }
                onChange={() =>
                  toggleAllRoles(roles.data.map((role) => role.id))
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
              onClick={() => handleSort("description")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Description</span>
                <Transition
                  mounted={sortBy === "description"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "description" && (
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
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {roles && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{roles.take}</strong> of{" "}
              <strong>{roles.totalElements}</strong> entries
            </span>
          )}

          <Group gap={4}>
            <Text size="xs" fw={700}>
              Per page:
            </Text>
            <NumberInput maw={50} size="xs" value={size} onChange={setSize} />
          </Group>
        </Group>

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={roles?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default RoleTable;
