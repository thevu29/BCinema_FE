import { IconPlus, IconTable, IconCalendarMonth } from "@tabler/icons-react";
import { Button, Group, Tabs, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import ScheduleTable from "./ScheduleTable";
import Search from "../Search/Search";
import ScheduleCalendar from "./Caledar/ScheduleCaledar";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules" },
];

const Schedule = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Schedules
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="flex-end" mb={24}>
          <Link to="/admin/schedules/auto-create">
            <Button
              leftSection={<IconPlus />}
              variant="outline"
              color="indigo"
              radius="md"
            >
              Auto create schedule
            </Button>
          </Link>
          <Link to="/admin/schedules/create">
            <Button
              leftSection={<IconPlus />}
              variant="filled"
              color="indigo"
              radius="md"
            >
              Create schedule
            </Button>
          </Link>
        </Group>

        <Tabs defaultValue="calendar">
          <Tabs.List>
            <Tabs.Tab value="calendar" leftSection={<IconCalendarMonth />}>
              Calendar
            </Tabs.Tab>
            <Tabs.Tab value="table" leftSection={<IconTable />}>
              Table
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="calendar">
            <div className="mt-8">
              <ScheduleCalendar />
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="table">
            <div className="mt-8">
              <Group justify="space-between" mb={24}>
                <Search placeholder="Search schedules" />
              </Group>

              <ScheduleTable />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default Schedule;
