import { Group, Text, ScrollArea, ThemeIcon, Image } from "@mantine/core";
import { IconUser, IconGauge, IconLock } from "@tabler/icons-react";
import NavbarFooter from "./NavbarFooter";
import LinksGroup from "./NavbarLinksGroup";
import classes from "./Navbar.module.scss";
import logoImage from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import clsx from "clsx";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, link: "/admin" },
  { label: "Users", icon: IconUser, link: "/admin/users" },
  {
    label: "Security",
    icon: IconLock,
    links: [
      { label: "Enable 2FA", link: "/" },
      { label: "Change password", link: "/" },
      { label: "Recovery codes", link: "/" },
    ],
  },
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
                ClinicCare
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
