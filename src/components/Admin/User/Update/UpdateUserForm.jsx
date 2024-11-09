import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import {
  getUserByIdService,
  updateUserService,
} from "../../../../services/userService";
import { getRolesService } from "../../../../services/roleService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import AvatarDropzone from "../Dropzone/Dropzone";
import { showNotification } from "../../../../utils/notication";
import { Link, useParams } from "react-router-dom";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Users", href: "/admin/users" },
  { title: "Update user", href: "/admin/users/update" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
  phone: {
    pattern: {
      value: /^\d{10}$/,
      message: "Phone number must contain exactly 10 digits",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
  },
  role: {
    required: "Role is required",
  },
  specialty: {
    required: "Specialty is required",
  },
};

const UpdateUserForm = () => {
  const { id } = useParams();

  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      image: "",
      roleId: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await getRolesService();
        if (rolesRes.success) {
          const rolesData = rolesRes.data
            .map((role) => ({
              value: role.roleId,
              label: role.name,
            }))
            .filter((role) => role.label !== "User");

          setRoles(rolesData);

          const userRes = await getUserByIdService(id);
          if (userRes.success) {
            const user = userRes.data;
            setUser(user);

            const userRole =
              rolesData.find((role) => role.label === user.role)?.value || "";

            reset({
              name: user.name,
              phone: user.phone,
              image: user.image,
              roleId: userRole,
            });
          }
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

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "image") {
          formData.append(key, data[key]);
        }
      });

      if (data.image && typeof data.image !== "string") {
        formData.append("image", data.image);
      }

      const response = await updateUserService(id, formData);

      response.success
        ? showNotification(response.message, "Success")
        : showNotification(response.message, "Error");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    setValue("image", file);
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
        Update User
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
                    placeholder="Enter your name"
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                rules={FORM_VALIDATION.phone}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Phone"
                    size="md"
                    type="number"
                    placeholder="Enter your phone number"
                  />
                )}
              />
            </Flex>

            <Controller
              name="image"
              control={control}
              render={() => (
                <AvatarDropzone user={user} onUpload={handleImageUpload} />
              )}
            />
          </Group>

          {user && user.role.toLowerCase() !== "user" && (
            <Group grow mt={20}>
              <Controller
                name="roleId"
                control={control}
                rules={FORM_VALIDATION.role}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    defaultValue={field.value}
                    label="Role"
                    placeholder="Select role"
                    data={roles}
                    allowDeselect={false}
                  />
                )}
              />
            </Group>
          )}

          <Group mt={32} justify="flex-end">
            <Link to="/admin/users">
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

export default UpdateUserForm;
