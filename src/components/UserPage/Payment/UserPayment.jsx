import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Accordion,
  Button,
  Group,
  Input,
  LoadingOverlay,
  NumberInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../context/Auth/authContext";
import { formatCurrency } from "../../../utils/currency";
import { showNotification } from "../../../utils/notification";
import {
  addPaymentService,
  momoBankingUrlService,
} from "../../../services/paymentService";
import {
  checkVoucherByCodeService,
  getVoucherByCodeService,
} from "../../../services/voucherService";
import MomoImage from "../../../assets/images/momo-img.png";

const UserPayment = () => {
  const { token } = useAuth();

  const location = useLocation();
  const state = location?.state;

  const selectedSeats = useMemo(() => state?.selectedSeats || [], [state]);
  const selectedFoods = useMemo(() => state?.selectedFoods || [], [state]);

  const { scheduleId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [voucher, setVoucher] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const [point, setPoint] = useState(0);
  const [pointError, setPointError] = useState("");
  const [pointDiscount, setPointDiscount] = useState(0);

  useEffect(() => {
    if (token) setUser(jwtDecode(token));
  }, [token]);

  useEffect(() => {
    const price = selectedSeats.reduce((total, seat) => total + seat.price, 0);

    const foodPrice = selectedFoods.reduce(
      (total, food) => total + food.price * food.quantity,
      0
    );

    setTotalPrice(price + foodPrice);
  }, [selectedSeats, selectedFoods]);

  const groupSeatsByType = (seats) => {
    return seats.reduce((acc, seat) => {
      const type = seat.type || "Regular";

      if (!acc[type]) {
        acc[type] = {
          quantity: 1,
          type: type,
          price: seat.price,
        };
      } else {
        acc[type].quantity += 1;
      }

      return acc;
    }, {});
  };

  const handleAddPayment = async () => {
    try {
      setIsLoading(true);

      let paymentDetails = [];

      if (selectedSeats && selectedSeats.length > 0) {
        const seatDetails = selectedSeats.map((seat) => ({
          seatScheduleId: seat.id,
        }));

        paymentDetails = [...paymentDetails, ...seatDetails];
      }

      if (selectedFoods && selectedFoods.length > 0) {
        const foodDetails = selectedFoods.map((food) => ({
          foodId: food.id,
          foodQuantity: food.quantity,
        }));

        paymentDetails = [...paymentDetails, ...foodDetails];
      }

      const data = {
        userId: user.id,
        scheduleId,
        paymentDetails,
        voucherId: voucher?.id,
        point
      };

      const res = await addPaymentService(data);

      if (res.success) {
        const paymentId = res.data.id;
        handleCreateMomoPaymentUrl(paymentId);
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

  const handleCreateMomoPaymentUrl = async (paymentId) => {
    try {
      const response = await momoBankingUrlService(paymentId);
      const momoUrl = response.data;

      window.location.href = momoUrl;
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    }
  };

  const handleUseVoucher = async () => {
    try {
      setIsLoading(true);

      if (!voucherCode) {
        setVoucherError("Vui lòng nhập mã!");
        return;
      }

      const isUsedVoucherRes = await checkVoucherByCodeService(
        user.id,
        voucherCode
      );

      if (isUsedVoucherRes.success) {
        if (isUsedVoucherRes.isUsed) {
          showNotification("Mã giảm giá đã được sử dụng!", "Error");
          return;
        }

        const voucherRes = await getVoucherByCodeService(voucherCode);

        if (voucherRes.success) {
          const voucherData = voucherRes.data;

          if (voucherData.discount > totalPrice) {
            showNotification(
              "Không được sử dụng mã giảm giá cho hóa đơn có tổng số tiền nhỏ hơn giảm giá!",
              "Warning"
            );
          }

          showNotification("Sử dụng mã giảm giá thành công!", "Success");
          setVoucher(voucherData);
          setVoucherDiscount((totalPrice * voucherData.discount) / 100);
          setVoucherError("");
        } else {
          showNotification(voucherRes.message, "Error");
        }
      } else {
        showNotification(isUsedVoucherRes.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsePoint = async () => {
    try {
      setIsLoading(true);

      if (!point) {
        setPointError("Vui lòng nhập số điểm!");
        return;
      }

      setPointError("");

      if (point > user.point) {
        showNotification("Điểm của bạn không đủ!", "Error");
        return;
      }

      const pointDiscount = (point * 100000) / 100;

      if (pointDiscount > totalPrice) {
        showNotification(
          "Không được sử dụng điểm cho hóa đơn có tổng số tiền nhỏ hơn giảm giá!",
          "Warning"
        );
        return;
      }

      showNotification("Sử dụng điểm thành công!", "Success");
      setPointDiscount(pointDiscount);
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay
        zIndex={1000}
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <div className="bg-slate-100 min-h-screen py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <Title order={1} mb={16}>
            Thanh toán
          </Title>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Thông tin thanh toán
                </h2>

                <Group align="center" gap={48}>
                  <Text size="md">Họ Tên: {user?.name}</Text>
                  <Text size="md">Email: {user?.email}</Text>
                </Group>
              </div>

              <div className="bg-white rounded-lg shadow p-6 mt-5">
                <h2 className="text-lg font-semibold mb-4">Giảm giá</h2>

                <Accordion variant="separated">
                  <Accordion.Item value="voucher">
                    <Accordion.Control>Mã giảm giá</Accordion.Control>
                    <Accordion.Panel>
                      <TextInput
                        placeholder="Nhập mã giảm giá"
                        value={voucherCode}
                        error={voucherError}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      />
                      <Group mt={24} justify="end">
                        <Button onClick={handleUseVoucher} variant="filled">
                          Đổi mã
                        </Button>
                      </Group>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="point">
                    <Accordion.Control>Đổi điểm</Accordion.Control>
                    <Accordion.Panel>
                      <div className="flex items-center">
                        <Input.Wrapper
                          label={`Số điểm hiện có: ${user?.point} điểm`}
                        >
                          <div className="flex items-center gap-3">
                            <NumberInput
                              hideControls
                              min={0}
                              // max={user?.point || 0}
                              placeholder="Nhập số điểm"
                              value={point}
                              error={pointError}
                              onChange={setPoint}
                            />
                            <span className="text-2xl">=</span>
                            <Input value={pointDiscount ?? 0} disabled />
                            <span className="text-sm">
                              (100 điểm = 100.000đ)
                            </span>
                            <Button
                              variant="filled"
                              size="xs"
                              onClick={handleUsePoint}
                            >
                              Đổi
                            </Button>
                          </div>
                        </Input.Wrapper>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </div>

              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-semibold mb-2">Thanh toán</h2>
                <div>
                  <div className="flex items-center gap-3">
                    <input type="radio" defaultChecked />
                    <img className="size-8 rounded-lg" src={MomoImage} />
                    <span className="text-sm">Momo Banking</span>
                  </div>

                  <Button
                    variant="filled"
                    mt={24}
                    fullWidth
                    onClick={handleAddPayment}
                  >
                    Thanh toán
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold pb-2 mb-2 border-b-[1px] border-b-slate-200">
                  Tổng cộng
                </h2>
                <div>
                  {selectedSeats &&
                    selectedSeats.length > 0 &&
                    Object.values(groupSeatsByType(selectedSeats)).map(
                      (seatGroup, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <span>
                            {seatGroup.quantity} Ghế {seatGroup.type}
                          </span>
                          <span>
                            {formatCurrency(
                              seatGroup.quantity * seatGroup.price
                            )}
                            đ
                          </span>
                        </div>
                      )
                    )}
                  {selectedFoods &&
                    selectedFoods.length > 0 &&
                    selectedFoods.map((food) => (
                      <div key={food.id} className="flex justify-between py-2">
                        <span>
                          {food.quantity} {food.name}
                        </span>
                        <span>
                          {formatCurrency(food.quantity * food.price)}đ
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-semibold pb-2 mb-2 border-b-[1px] border-b-slate-200">
                  Khuyến mãi
                </h2>
                <h2 className="text-lg text-center">
                  {formatCurrency(voucherDiscount + pointDiscount)}đ
                </h2>
              </div>

              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-lg font-semibold pb-2 mb-2 border-b-[1px] border-b-slate-200">
                  Tổng số tiền thanh toán
                </h2>
                <h2 className="text-lg text-center">
                  {formatCurrency(
                    totalPrice - (voucherDiscount + pointDiscount)
                  )}
                  đ
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPayment;
