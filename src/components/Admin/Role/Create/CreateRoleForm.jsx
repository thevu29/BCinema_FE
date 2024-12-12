import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { addRoleService } from "../../../../services/roleService";
import { showNotification } from "../../../../utils/notification";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Roles", href: "/admin/roles" },
  { title: "Create role" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
  description: {
    required: "Description is required",
  },
};

const CreateRoleForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await addRoleService(data);

      if (response && response.success) {
        showNotification(response.message, "Success");
        navigate("/admin/roles");
      } else {
        showNotification(response.message, "Error");
      }
    } catch (error) {
      console.log(error);
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
        Create Role
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
};
export default CreateRoleForm;
