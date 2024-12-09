import { Button, Flex, Group, PasswordInput, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";

import { showNotification } from "../../../utils/notification";
import { registerService } from "../../../services/authService";
import AvatarDropzone from "../../Admin/User/Dropzone/Dropzone";

const FORM_VALIDATION = {
  name: {
    required: "Tên không được để trống",
  },
  email: {
    required: "Email không được để trống",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: "Email không hợp lệ",
    },
  },
  password: {
    required: "Mật khẩu không được để trống",
  },
  confirmPassword: {
    required: "Mật khẩu không khớp",
  },
};

const RegisterForm = ({ setEmail, nextStep, setIsLoading }) => {
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  const handleImageUpload = (file) => {
    setValue("avatar", file);
  };

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

      const res = await registerService(formData);

      if (res.success) {
        setEmail(res.data.email);
        nextStep();
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

  return (
    <div className="relative max-w-[700px] my-[48px] mx-auto py-12 px-14 bg-white rounded-[4px] shadow-[0_3px_10px_0_rgba(0,0,0,0.14)]">
      <h1 className="text-[20px] font-bold text-center mb-6">Tạo tài khoản</h1>

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
                  withAsterisk
                  error={error?.message}
                  label="Họ và tên"
                  size="md"
                  placeholder="Nhập họ và tên"
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
                  placeholder="Nhập email"
                />
              )}
            />
          </Flex>

          <Controller
            name="avatar"
            control={control}
            render={() => <AvatarDropzone onUpload={handleImageUpload} />}
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
                withAsterisk
                error={error?.message}
                label="Mật khẩu"
                size="md"
                placeholder="Nhập mật khẩu"
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              ...FORM_VALIDATION.confirmPassword,
              validate: (value) => value === password || "Mật khẩu không khớp",
            }}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput
                {...field}
                withAsterisk
                label="Nhập lại mật khẩu"
                size="md"
                error={error?.message}
                placeholder="Nhập lại mật khẩu"
              />
            )}
          />
        </Group>

        <Button type="submit" variant="filled" fullWidth mt={32}>
          Đăng ký
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
