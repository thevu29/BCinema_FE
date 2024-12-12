import {
  Avatar,
  Button,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/authContext";
import classes from "./Header.module.scss";
import Logo from "../../../assets/images/logo.png";
import clsx from "clsx";
import {
  IconTicket,
  IconChevronDown,
  IconLogout,
  IconGift,
  IconSettings,
  IconDiscount,
} from "@tabler/icons-react";
import { logoutService } from "../../../services/authService";
import { showNotification } from "../../../utils/notification";

const Header = () => {
  const { user, removeToken } = useAuth();

  const navigate = useNavigate();

  const theme = useMantineTheme();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await logoutService();

      if (res.success) {
        showNotification("Đăng xuất thành công", "Success");
        removeToken();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
    }
  };

  return (
    <header className={classes.header}>
      <Group justify="space-between" h="100%">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-8" />
          <Text fw={700} size="lg">
            BCinema
          </Text>
        </Link>

        <Group h="100%" gap={0} visibleFrom="sm">
          <Link to="/" className={classes.link}>
            Trang chủ
          </Link>
          <Link to="/movies" className={classes.link}>
            Phim
          </Link>
          <Link to="/ticket-price" className={classes.link}>
            Giá vé
          </Link>
        </Group>

        {user ? (
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={clsx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7}>
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name}
                    key={user?.name}
                    name={user?.name}
                    radius="xl"
                    size={20}
                  />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user?.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Link to="/account/payments">
                <Menu.Item
                  leftSection={
                    <IconTicket
                      size={16}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Lịch sử đặt vé
                </Menu.Item>
              </Link>
              <Link to="/account/points">
                <Menu.Item
                  leftSection={
                    <IconGift
                      size={16}
                      color={theme.colors.yellow[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Điểm thưởng
                </Menu.Item>
              </Link>
              <Link to="/account/vouchers">
                <Menu.Item
                  leftSection={
                    <IconDiscount
                      size={16}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Voucher sử dụng
                </Menu.Item>
              </Link>

              <Menu.Label>Tài khoản</Menu.Label>
              <Link to="account/information">
                <Menu.Item
                  leftSection={<IconSettings size={16} stroke={1.5} />}
                >
                  Thông tin cá nhân
                </Menu.Item>
              </Link>
              <Menu.Item
                leftSection={<IconLogout size={16} stroke={1.5} />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Group visibleFrom="sm">
            <Link to="/login">
              <Button variant="default">Đăng nhập</Button>
            </Link>
            <Link to="/register">
              <Button>Đăng ký</Button>
            </Link>
          </Group>
        )}
      </Group>
    </header>
  );
};

export default Header;
