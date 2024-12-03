import {
    IconChevronDown,
    IconMessage,
    IconMovie,
    IconDeviceTv,
  } from "@tabler/icons-react";
  import {
    Avatar,
    Box,
    Button,
    Center,
    Group,
    HoverCard,
    Menu,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
  } from "@mantine/core";
  import { Link } from "react-router-dom";
  import classes from "./Header.module.scss";
  import Logo from "../../../assets/images/logo.png";
  
  const mockdata = [
    {
      icon: IconMovie,
      title: "Phim đang chiếu",
      description: "Đặt vé xem phim đang chiếu ngay hôm nay",
    },
    {
      icon: IconDeviceTv,
      title: "Phim sắp chiếu",
      description: "Khám phá và đặt vé cho phim sắp ra mắt",
    },
  ];
  
  const Header = () => {
    const theme = useMantineTheme();
  
    const links = mockdata.map((item) => (
      <UnstyledButton className={classes.subLink} key={item.title}>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon size={22} color={theme.colors.blue[6]} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    ));
  
    return (
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-8" />
            <Text fw={700} size="lg">
              ClinicCare
            </Text>
          </Link>
  
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link to="/" className={classes.link}>
              Trang chủ
            </Link>
            <HoverCard position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <Link to="/" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Phim
                    </Box>
                    <IconChevronDown size={16} color={theme.colors.blue[6]} />
                  </Center>
                </Link>
              </HoverCard.Target>
  
              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <SimpleGrid cols={1} spacing={0}>
                  {links}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
            <Link to="/" className={classes.link}>
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
  