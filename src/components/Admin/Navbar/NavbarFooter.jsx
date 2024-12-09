import { UnstyledButton, Group, Avatar, Text } from "@mantine/core";
import { useAuth } from "../../../context/Auth/authContext";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import classes from "./NavbarFooter.module.scss";

const NavbarFooter = ({ isCollapsed }) => {
  const { token } = useAuth();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      setUserName(decodedToken.name);
      setEmail(decodedToken.email);
      setImage(decodedToken.image);
    }
  }, [token]);

  return (
    <UnstyledButton className={classes.user}>
      <Group wrap="no">
        <Avatar
          src={image}
          alt={userName}
          name={userName}
          key={userName}
          radius="xl"
        />

        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {userName}
            </Text>

            <Text c="dimmed" size="xs">
              {email}
            </Text>
          </div>
        )}
      </Group>
    </UnstyledButton>
  );
};

export default NavbarFooter;
