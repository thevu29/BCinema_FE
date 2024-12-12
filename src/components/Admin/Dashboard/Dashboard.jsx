import {
  Avatar,
  Flex,
  Group,
  NumberInput,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { IconUser } from "@tabler/icons-react";
import { showNotification } from "../../../utils/notification";
import {
  getRevenueService,
  getTopMoviesService,
  getUserRegistrationService,
} from "../../../services/dashboardService";

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const month = new Date().getMonth() + 1;

const Dashboard = () => {
  const [revenues, setRevenues] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [topMovies, setTopMovies] = useState([]);
  const [top, setTop] = useState(5);

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        const data = await Promise.all(
          months.map(async (item) => {
            const res = await getRevenueService({
              month: +item.value,
              year: 2024,
            });

            if (!res.success) {
              showNotification(res.message, "Error");
              return null;
            }

            return {
              month: item.label,
              Revenue: res.data.toLocaleString(),
            };
          })
        );

        setRevenues(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUserStatistics = async () => {
      try {
        const res = await getUserRegistrationService({ month, year: 2024 });

        if (!res.success) {
          showNotification(res.message, "Error");
          return;
        }

        setUserCount(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRevenues();
    fetchUserStatistics();
  }, []);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const res = await getTopMoviesService({
          month,
          year: 2024,
          count: top,
        });

        if (!res.success) {
          showNotification(res.message, "Error");
          return;
        }

        setTopMovies(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTopMovies();
  }, [top]);

  const rows =
    topMovies &&
    topMovies.length > 0 &&
    topMovies.map((service) => (
      <Table.Tr key={service.serviceId}>
        <Table.Td>
          {service.image ? (
            <Avatar size="sm" src={service.image} alt="Service Image" />
          ) : (
            <Avatar size="sm" />
          )}
        </Table.Td>
        <Table.Td>{service.name}</Table.Td>
        <Table.Td>{service.price}</Table.Td>
        <Table.Td>{service.discount}</Table.Td>
        <Table.Td>{service.count}</Table.Td>
      </Table.Tr>
    ));

  return (
    <div className="pb-8">
      <Title order={1} mt={32}>
        Dashboard
      </Title>

      <div className="p-4 mt-5 flex justify-between gap-5">
        <Flex direction="column" justify="center" className="rounded-md">
          <div className="flex items-center justify-center bg-blue-500 text-white p-12 rounded-md">
            <IconUser size={28} />
            <span className="font-bold text-lg ml-2">Users: {userCount}</span>
          </div>
        </Flex>

        <Flex p={16} direction="column" className="bg-white flex-1 rounded-md">
          <Title className="text-center" order={4} mb={32}>
            Revenue Chart Of 2024
          </Title>

          <BarChart
            h={300}
            data={revenues}
            dataKey="month"
            tooltipAnimationDuration={200}
            unit="VND"
            series={[{ name: "Revenue", color: "indigo" }]}
            tickLine="y"
          />
        </Flex>
      </div>

      <Flex p={24} direction="column" className="bg-white rounded-md mt-10">
        <Title className="text-center" order={4} mb={32}>
          Top Movies
        </Title>

        <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Name</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Promotion(%)</Table.Th>
              <Table.Th>Appointments</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Group mt="md">
          <Text size="xs" fw={700}>
            Top:
          </Text>
          <NumberInput maw={50} size="xs" value={top} onChange={setTop} />
        </Group>
      </Flex>
    </div>
  );
};

export default Dashboard;
