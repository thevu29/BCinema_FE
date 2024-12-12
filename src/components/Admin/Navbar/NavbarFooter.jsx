import { UnstyledButton, Group, Avatar, Text } from "@mantine/core";
import { useAuth } from "../../../context/Auth/authContext";
import classes from "./NavbarFooter.module.scss";

const NavbarFooter = ({ isCollapsed }) => {
  const { user } = useAuth();

  return (
    <UnstyledButton className={classes.user}>
      <Group wrap="no">
        <Avatar
          src={user?.avatar}
          alt={user?.name}
          name={user?.name}
          key={user?.name}
          radius="xl"
        />

        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {user?.name}
            </Text>

            <Text c="dimmed" size="xs">
              {user?.email}
            </Text>
          </div>
        )}
      </Group>
    </UnstyledButton>
  );
};

export default NavbarFooter;
