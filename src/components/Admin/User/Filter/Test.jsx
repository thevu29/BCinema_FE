import { Menu, Button } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import FilterUser from "./FilterUser";

export default function Test() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="white" color="rgba(0, 0, 0, 1)" size="xs">
          <IconFilter width={18} height={18} />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <FilterUser />
      </Menu.Dropdown>
    </Menu>
  );
}
