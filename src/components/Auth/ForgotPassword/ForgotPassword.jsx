import { Group, LoadingOverlay, Stepper, Text } from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import SendOtpForm from "./SendOtpForm";
import VerifyOtpForm from "./VerifiOtpForm";

const breadcumbData = [
  { title: "Trang chủ", href: "/" },
  { title: "Đăng nhập", href: "/login" },
  { title: "Quên mật khẩu" },
];

const ForgotPassword = () => {
  const [active, setActive] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className="container mx-auto px-24 py-12">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Group justify="between" grow>
        <BreadcumbsComponent items={breadcumbData} />

        <Group justify="end" gap={2}>
          <Link to="/login">
            <Text
              size="xs"
              c="indigo"
              className="cursor-pointer hover:underline"
            >
              Đăng nhập
            </Text>
          </Link>
        </Group>
      </Group>

      <div className="max-w-[800px] mx-auto pt-12">
        <Stepper
          size="md"
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Bước 1" description="Nhập email">
            <SendOtpForm
              setEmail={setEmail}
              nextStep={nextStep}
              setIsLoading={setIsLoading}
            />
          </Stepper.Step>
          <Stepper.Step label="Bước 2" description="Xác thực email">
            <VerifyOtpForm
              email={email}
              prevStep={prevStep}
              setIsLoading={setIsLoading}
            />
          </Stepper.Step>
        </Stepper>
      </div>
    </div>
  );
};

export default ForgotPassword;
