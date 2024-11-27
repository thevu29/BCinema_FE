import { Link, useLocation } from "react-router-dom";
import { ActionIcon, Group, Table, Text, Title } from "@mantine/core";
import { IconEdit, IconArmchair } from "@tabler/icons-react";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import clsx from "clsx";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Schedule details" },
];

const ScheduleDetail = () => {
  const location = useLocation();
  const schedule = location.state?.schedule;

  const rows =
    schedule &&
    schedule.schedules &&
    schedule.schedules.length > 0 &&
    schedule.schedules.map((schedule) => (
      <Table.Tr key={schedule.id}>
        <Table.Td>{schedule.time}</Table.Td>
        <Table.Td>
          <span
            className={clsx("p-3 text-white", {
              "bg-blue-600": schedule.status === "Available",
              "bg-red-600": schedule.status === "Cancelled",
              "bg-gray-600": schedule.status === "Ended",
            })}
          >
            {schedule.status}
          </span>
        </Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/schedules/${schedule.id}/update`}>
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
            <Link to={`/admin/schedules/${schedule.id}/seat-schedules`}>
              <ActionIcon
                variant="transparent"
                color="black"
                radius="xl"
                title="View seats"
              >
                <IconArmchair
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
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Schedule details
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Text size="xl" fw={700} mb="md" px={16}>
          {schedule?.movieName} - {schedule?.roomName} -{" "}
          {new Date(schedule?.date).toLocaleDateString()}
        </Text>

        <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Time</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </>
  );
};

export default ScheduleDetail;
