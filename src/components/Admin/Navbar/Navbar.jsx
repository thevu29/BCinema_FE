import { Group, Text, ScrollArea, ThemeIcon, Image } from "@mantine/core";
import {
  IconUser,
  IconGauge,
  IconHome2,
  IconCalendarFilled,
  IconTicket,
  IconKey,
  IconArmchair,
} from "@tabler/icons-react";
import NavbarFooter from "./NavbarFooter";
import LinksGroup from "./NavbarLinksGroup";
import classes from "./Navbar.module.scss";
import logoImage from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import clsx from "clsx";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, link: "/admin" },
  { label: "Roles", icon: IconKey, link: "/admin/roles" },
  { label: "Users", icon: IconUser, link: "/admin/users" },
  { label: "Rooms", icon: IconHome2, link: "/admin/rooms" },
  {
    label: "Seats",
    icon: IconArmchair,
    links: [
      { label: "Seats", link: "/admin/seats" },
      { label: "Seat Types", link: "/admin/seat-types" },
    ],
  },
  { label: "Schedules", icon: IconCalendarFilled, link: "/admin/schedules" },
  { label: "Vouchers", icon: IconTicket, link: "/admin/vouchers" },
];

const Navbar = ({ isCollapsed }) => {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} isCollapsed={isCollapsed} key={item.label} />
  ));

  return (
    <nav
      className={clsx(
        classes.navbar,
        "transition-all duration-300",
        isCollapsed ? "w-[65px]" : "w-[300px]"
      )}
    >
      <div className={classes.header}>
        <Link to="/admin">
          <Group wrap="no">
            <ThemeIcon variant="white" radius="xl">
              <Image w="auto" fit="contain" src={logoImage} />
            </ThemeIcon>
            {!isCollapsed && (
              <Text
                size="xl"
                fw={900}
                className={clsx(
                  classes.logoText,
                  isCollapsed ? classes.collapsed : classes.expanded
                )}
              >
                BCinema
              </Text>
            )}
          </Group>
        </Link>
      </div>

      <ScrollArea className={classes.links}>
        <div className={`${classes.linksInner} overflow-x-hidden`}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <NavbarFooter isCollapsed={isCollapsed} />
      </div>
    </nav>
  );
};

export default Navbar;
