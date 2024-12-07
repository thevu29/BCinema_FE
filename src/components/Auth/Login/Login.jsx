import {
  Button,
  Divider,
  Group,
  Input,
  LoadingOverlay,
  PasswordInput,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { showNotification } from "../../../utils/notification";
import { loginService } from "../../../services/authService";
import { useAuth } from "../../../context/Auth/authContext";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginGoogleService } from "../../../services/authService";
import classes from "./Login.module.scss";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Trang chủ", href: "/" },
  { title: "Đăng nhập" },
];

const Login = () => {
  const navigate = useNavigate();
  const { token, saveToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await loginService(data.email, data.password);

      if (res.success) {
        const accessToken = res.data.accessToken;
        saveToken(accessToken);

        const decodedToken = jwtDecode(accessToken);
        const userRole = decodedToken.role.toLowerCase();

        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
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

  const handleGoogleLoginSuccess = async (response) => {
    const idToken = response.credential;
    const res = await loginGoogleService(idToken);

    if (res.success) {
      const accessToken = res.data.accessToken;
      saveToken(accessToken);

      const decodedToken = jwtDecode(accessToken);
      const userRole = decodedToken.role.toLowerCase();

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      showNotification(res.message, "Error");
    }
  };

  const handleGoogleLoginFailure = (response) => {
    console.error("Google login failed:", response);
    showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
  };

  if (token) {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role.toLowerCase();
    return userRole === "admin" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/" />
    );
  }

  return (
    <div className="container mx-auto px-24 py-12">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <BreadcumbsComponent items={breadcumbData} />

      <div className="max-w-[500px] mx-auto pt-4">
        <div className="relative max-w-[700px] mt-[48px] mx-auto py-12 px-14 bg-white rounded-[4px] shadow-[0_3px_10px_0_rgba(0,0,0,0.14)]">
          <h1 className="text-[20px] font-bold text-center mb-6">Đăng nhập</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email không được để trống",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input.Wrapper label="Email" error={error?.message}>
                  <Input
                    {...(error ? { error: true } : {})}
                    {...field}
                    className="mt-1"
                    size="md"
                    placeholder="Nhập email"
                  />
                </Input.Wrapper>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Mật khẩu không được để trống",
              }}
              render={({ field, fieldState: { error } }) => (
                <Input.Wrapper
                  label="Mật khẩu"
                  className="mt-4"
                  error={error?.message}
                >
                  <PasswordInput
                    {...(error ? { error: true } : {})}
                    {...field}
                    className="mt-1"
                    size="md"
                    placeholder="Nhập mật khẩu"
                  />
                </Input.Wrapper>
              )}
            />

            <Button fullWidth mt="xl" size="md" type="submit">
              Đăng nhập
            </Button>
          </form>
          <Group justify="end" mt="xs">
            <Text
              size="sm"
              c="indigo"
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Quên mật khẩu
            </Text>
          </Group>
          <Divider label="Hoặc" labelPosition="center" my="lg" />

          <GoogleOAuthProvider clientId="914759852648-c8aqn5tlhs2hupf3jtnmt09hane2s322.apps.googleusercontent.com">
            <div className={classes.wrapper}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </div>
          </GoogleOAuthProvider>

          <Group justify="center" mt="xl" gap={2}>
            <Text size="sm">Chưa có tài khoản?</Text>
            <Text
              size="sm"
              c="indigo"
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </Text>
          </Group>
        </div>
      </div>
    </div>
  );
};

export default Login;
