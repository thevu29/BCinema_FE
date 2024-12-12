import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Flex, Group, LoadingOverlay, TextInput } from "@mantine/core";
import {
  getUserByIdService,
  updateUserService,
} from "../../../../services/userService";
import { showNotification } from "../../../../utils/notification";
import { useAuth } from "../../../../context/Auth/authContext";
import ImageDropzone from "../../../Dropzone/ImageDropzone";

const AccountInformation = () => {
  const { user, setUser } = useAuth();

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
        const res = await getUserByIdService(user.id);

        if (res.success) {
          const userData = res.data;
          setUser(userData);

          reset({
            name: userData.name,
            avatar: userData.avatar,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Only fetch if we have a user.id
    if (user?.id) {
      fetchData();
    }
  }, []);

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

      const res = await updateUserService(user.id, formData);

      if (res && res.success) {
        showNotification(res.message, "Success");

        setUser((prevUser) => ({
          ...prevUser,
          avatar: res.data.avatar,
          name: data.name,
        }));
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
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

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <TextInput
                defaultValue={user?.email}
                disabled
                label="Email"
                size="md"
              />

              <Controller
                name="name"
                control={control}
                rules={{ required: "Vui lòng nhập họ tên" }}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Họ và tên"
                    size="md"
                    placeholder="Nhập họ và tên"
                  />
                )}
              />

              <TextInput
                defaultValue={user?.point}
                disabled
                label="Điểm tích lũy"
                size="md"
              />
            </Flex>

            <Controller
              name="avatar"
              control={control}
              render={() => (
                <ImageDropzone object={user} onUpload={handleAvatarUpload} />
              )}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Button type="submit" variant="filled">
              Lưu
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
};

export default AccountInformation;
