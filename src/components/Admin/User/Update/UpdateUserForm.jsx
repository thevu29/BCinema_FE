import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import {
  getUserByIdService,
  updateUserService,
} from "../../../../services/userService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import AvatarDropzone from "../Dropzone/Dropzone";
import { showNotification } from "../../../../utils/notification";
import { Link, useParams, useNavigate } from "react-router-dom";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Users", href: "/admin/users" },
  { title: "Update user", href: "/admin/users/update" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
};

const UpdateUserForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      avatar: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserByIdService(id);
        if (res.success) {
          const user = res.data;
          setUser(user);

          reset({
            name: user.name,
            avatar: user.avatar,
          });
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
        if (key !== "avatar") {
          formData.append(key, data[key]);
        }
      });

      if (data.avatar && typeof data.avatar !== "string") {
        formData.append("avatar", data.avatar);
      }

      const response = await updateUserService(id, formData);

      if (response && response.success) {
        showNotification(response.message, "Success");
        navigate("/admin/users");
      } else {
        showNotification(response.message, "Error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
        Update User
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                mb="md"
                placeholder="Enter your name"
              />
            )}
          />

          <Controller
            name="avatar"
            control={control}
            render={() => (
              <AvatarDropzone user={user} onUpload={handleAvatarUpload} />
            )}
          />

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
