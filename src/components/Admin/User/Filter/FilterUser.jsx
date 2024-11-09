import { Button, Menu, Select } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getRolesService } from "../../../../services/roleService";
import { useLocation, useNavigate } from "react-router-dom";

const FilterUser = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRolesService();
        if (res.success) {
          const data = res.data.map((role) => ({
            value: role.roleId,
            label: role.name,
          }));
          setRoles(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);

    const params = new URLSearchParams(window.location.search);
    
    params.set("role", role);
    params.delete("page");

    if (!role) params.delete("role");

    navigate(`${pathname}?${params.toString()}`);
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="white" color="rgba(0, 0, 0, 1)" size="xs">
          <IconFilter width={18} height={18} />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Select
          placeholder="Select role"
          data={roles}
          allowDeselect
          value={selectedRole}
          onChange={handleRoleChange}
          maw={150}
        />
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterUser;
