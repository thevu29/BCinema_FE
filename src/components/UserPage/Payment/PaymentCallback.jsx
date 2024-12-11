import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const errorCode = searchParams.get("error_code");

    navigate(`/order-status?orderId=${orderId}&error_code=${errorCode}`);
  }, [searchParams, navigate]);

  return <div>Đang thanh toán...</div>;
};

export default PaymentCallback;
