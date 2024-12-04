  import {
    Button,
    Group,
    Text,
  } from "@mantine/core";
  import { Link } from "react-router-dom";
  import classes from "./Header.module.scss";
  import Logo from "../../../assets/images/logo.png";
  
  
  const Header = () => {  
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
  
          <Group visibleFrom="sm">
            <Link to="/login">
              <Button variant="default">Đăng nhập</Button>
            </Link>
            <Link to="/register">
              <Button>Đăng ký</Button>
            </Link>
          </Group>
        </Group>
      </header>
    );
  };

export default Header;
  