import { Button, PasswordInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { forgotPasswordService } from "../../../services/authService";
import { showNotification } from "../../../utils/notification";
import { useNavigate } from "react-router-dom";

const NewPasswordForm = ({ email, otp, setIsLoading }) => {
  const navigate = useNavigate();

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await forgotPasswordService(email, otp, data.password);

      if (res.success) {
        showNotification(
          "Đặt lại mật khẩu thành công. Vui lòng đăng nhập để tiếp tục",
          "Success"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-[500px] my-[48px] mx-auto py-12 px-14 bg-white rounded-[4px] shadow-[0_3px_10px_0_rgba(0,0,0,0.14)]">
      <h1 className="text-[20px] font-bold text-center mb-6">Tạo mật khẩu</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Mật khẩu không được để trống",
          }}
          render={({ field, fieldState: { error } }) => (
            <PasswordInput
              {...field}
              withAsterisk
              error={error?.message}
              label="Mật khẩu mới"
              size="md"
              placeholder="Nhập mật khẩu mới"
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Mật khẩu không khớp",
            validate: (value) => value === password || "Mật khẩu không khớp",
          }}
          render={({ field, fieldState: { error } }) => (
            <PasswordInput
              {...field}
              withAsterisk
              error={error?.message}
              label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu"
              size="md"
              className="mt-4"
            />
          )}
        />
        <Button fullWidth mt="xl" size="md" type="submit">
          Xác nhận
        </Button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
