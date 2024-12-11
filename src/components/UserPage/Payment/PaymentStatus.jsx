import { Container, Text, Button, Center, Image, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const errorCode = searchParams.get("error_code");

    switch (errorCode) {
      case "0":
        setStatus("Thanh toán thành công");
        break;
      case "404":
        setStatus("Không tìm thấy thông tin thanh toán");
        break;
      case "500":
        setStatus("Thanh toán thất bại");
        break;
      default:
        setStatus("Thanh toán bị hủy");
    }
  }, [searchParams]);

  return (
    <Container
      size="sm"
      style={{ textAlign: "center", marginTop: "50px" }}
      py={48}
    >
      <Center>
        <Box w={120} h={120}>
          <Image
            src={
              searchParams.get("error_code") === "0"
                ? "https://cdn-icons-png.flaticon.com/512/190/190411.png"
                : "https://cdn-icons-png.flaticon.com/512/753/753345.png"
            }
            alt="Failure"
          />
        </Box>
      </Center>
      <Text size="md" mt="sm" c="dimmed">
        {status}
      </Text>
      <Button
        mt="lg"
        variant="outline"
        color="red"
        size="md"
        onClick={() => {
          navigate("/");
        }}
      >
        Trở về trang chủ
      </Button>
    </Container>
  );
};

export default PaymentStatus;
