import { useState } from "react";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { Button, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import FoodTable from "./FoodTable";
import Search from "../Search/Search";

const breadcumbData = [{ title: "Admin", href: "/admin" }, { title: "Foods", href: "/admin/foods" }];

const Food = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  return (

    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Foods
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search foods" />

          <Group>
            {selectedRows.length > 0 && (
              <Button variant="light" color="red" radius="md">
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
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </>
  );
};

export default Food;