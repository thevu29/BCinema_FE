import { useState, useEffect, useCallback } from "react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import { Button, Group, LoadingOverlay, Title } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import Search from "../Search/Search";
import RoleTable from "./RoleTable";
import { getRolesService } from "../../../services/roleService";
import { handleSorting } from "../../../utils/sort";

const breadcumbData = [{ title: "Admin", href: "/admin" }, { title: "Roles" }];

const Role = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const fetchRoles = useCallback(
    async (search, page, sortBy, sortOrder) => {
      try {
        const res = await getRolesService({
          search,
          page,
          size,
          sortBy,
          sortOrder,
        });

        if (res.success) {
          setRoles(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_order);

    fetchRoles(search, page, _sortBy, _order);
  }, [location.search, fetchRoles]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Roles
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search roles" />

          <Group>
            <Link to="/admin/roles/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create role
              </Button>
            </Link>
          </Group>
        </Group>
        <RoleTable
          roles={roles}
          sortBy={sortBy}
          sortOrder={sortOrder}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default Role;
