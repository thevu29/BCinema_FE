import { UnstyledButton, Group, Avatar, Text } from "@mantine/core";
import classes from "./NavbarFooter.module.scss";

const NavbarFooter = ({ isCollapsed }) => {
  return (
    <UnstyledButton className={classes.user}>
      <Group wrap="no">
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
        />

        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              Lâm Quốc Đại
            </Text>

            <Text c="dimmed" size="xs">
              daisex@gmail.com
            </Text>
          </div>
        )}
      </Group>
    </UnstyledButton>
  );
};

export default NavbarFooter;
