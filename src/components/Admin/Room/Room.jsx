import { useState } from "react";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { Button, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import RoomTable from "./RoomTable.jsx";
import Search from "../Search/Search";

const breadcumbData = [{ title: "Admin", href: "/admin" }, { title: "Rooms" }];

const Room = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Rooms
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search rooms" />

          <Group>
            {selectedRows.length > 0 && (
              <Button variant="light" color="red" radius="md">
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/rooms/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create room
              </Button>
            </Link>
          </Group>
        </Group>

        <RoomTable
        />
      </div>
    </>
  );
};

export default Room;
