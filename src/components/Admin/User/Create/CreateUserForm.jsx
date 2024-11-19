import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  PasswordInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getAllRoles } from "../../../../services/roleService";
import { addUserService } from "../../../../services/userService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import AvatarDropzone from "../Dropzone/Dropzone";
import { showNotification } from "../../../../utils/notification";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Users", href: "/admin/users" },
  { title: "Create user" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
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
};

const CreateUserForm = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
      roleId: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAllRoles();
        if (res.success) {
          const data = res.data.map((role) => ({
            value: role.id,
            label: role.name,
          }));

          setRoles(data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "avatar" && key !== "confirmPassword") {
          formData.append(key, data[key]);
        }
      });

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      const response = await addUserService(formData);

      if (response.success) {
        showNotification(response.message, "Success");
        navigate("/admin/users");
      } else {
        showNotification(response.message, "Error");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (file) => {
    setValue("avatar", file);
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
        Create User
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
                name="email"
                control={control}
                rules={FORM_VALIDATION.email}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Email"
                    size="md"
                    type="email"
                    placeholder="Enter your email"
                  />
                )}
              />

              <Controller
                name="roleId"
                control={control}
                rules={FORM_VALIDATION.role}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label="Role"
                    size="md"
                    placeholder="Select role"
                    data={roles}
                    allowDeselect={false}
                  />
                )}
              />
            </Flex>

            <Controller
              name="avatar"
              control={control}
              render={() => <AvatarDropzone onUpload={handleAvatarUpload} />}
            />
          </Group>

          <Group grow mt={20}>
            <Controller
              name="password"
              control={control}
              rules={FORM_VALIDATION.password}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  {...field}
                  error={error?.message}
                  label="Password"
                  size="md"
                  placeholder="Enter your password"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  {...field}
                  label="Confirm password"
                  size="md"
                  error={error?.message}
                  placeholder="Repeat your password"
                />
              )}
            />
          </Group>

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

export default CreateUserForm;
