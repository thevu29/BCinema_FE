import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
} from "@mantine/core";
import {
  getRoleServiceById,
  updateRoleService,
} from "../../../../services/roleService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Roles", href: "/admin/roles" },
  { title: "Update role" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
};

const UpdateRoleForm= () => {
  const { id } = useParams();

  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState({});

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await getRoleServiceById(id);
        if (rolesRes && rolesRes.success) {
          const currentRole = {
            name: rolesRes.data.name,
            description: rolesRes.data.description || "",
          };

          setCurrentRole(currentRole);
          reset(currentRole);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const payload = {};

      if (data.name.trim() !== currentRole.name) {
        payload.name = data.name.trim();
      }
      if (data.description.trim() !== currentRole.description) {
        payload.description = data.description.trim();
      }

      if (Object.keys(payload).length > 0) {
        const response = await updateRoleService(id, payload);
        if (response && response.success) {
          showNotification(response.message, "Success");
          navigate("/admin/roles");
        } else {
          showNotification(response.message, "Error");
        }
      } else {
        showNotification("No changes detected", "Warning");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
    setIsLoading(false);
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
        Update Role
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <Controller
                name="name"
                control={control}
                rules={FORM_VALIDATION.name}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Name"
                    size="md"
                    placeholder="Enter role's name"
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Description"
                    size="md"
                    placeholder="Enter role's description"
                  />
                )}
              />
            </Flex>
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/roles">
              <Button variant="filled" color="gray">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="filled">
              Save
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
}

export default UpdateRoleForm;