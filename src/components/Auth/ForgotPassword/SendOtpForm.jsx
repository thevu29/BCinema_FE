import { Button, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { sendOtpService } from "../../../services/authService";
import { showNotification } from "../../../utils/notification";

const SendOtpForm = ({ setEmail, nextStep, setIsLoading }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: "",
      otp: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await sendOtpService(data.email);
      if (res.success) {
        setEmail(data.email);
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
    <div className="relative max-w-[500px] my-[48px] mx-auto py-12 px-14 bg-white rounded-[4px] shadow-[0_3px_10px_0_rgba(0,0,0,0.14)]">
      <h1 className="text-[20px] font-bold text-center mb-6">Nhập email</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email không được để trống",
            pattern: {
              value: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",
              message: "Email không hợp lệ",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              error={error?.message}
              label="Email"
              placeholder="Nhập email"
            />
          )}
        />

        <Button fullWidth mt="xl" size="md" type="submit">
          Gửi mã OTP
        </Button>
      </form>
    </div>
  );
};

export default SendOtpForm;
