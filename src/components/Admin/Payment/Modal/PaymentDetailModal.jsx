import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { formatDate } from "../../../../utils/date";
import { formatCurrency } from "../../../../utils/currency";
import { getSeatScheduleById } from "../../../../services/seatScheduleService";
import { getFoodByIdService } from "../../../../services/foodService";
import { getVoucherByIdService } from "../../../../services/voucherService";

const PaymentDetailModal = ({ payment, opened, close }) => {
  const [voucher, setVoucher] = useState(null);
  const [point, setPoint] = useState({
    point: 0,
    discount: 0,
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);

  useEffect(() => {
    const fetchSelectedSeats = async () => {
      try {
        const seatSchedules = await Promise.all(
          payment.paymentDetails.map(async (paymentDetail) => {
            if (!paymentDetail.seatScheduleId) return null;

            const seat = await getSeatScheduleById(
              paymentDetail.seatScheduleId
            );
            return seat.data;
          })
        );

        const allNull = seatSchedules.every((seat) => seat === null);

        setSelectedSeats(
          allNull ? [] : seatSchedules.filter((seat) => seat !== null)
        );
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSelectedFoods = async () => {
      try {
        const foods = await Promise.all(
          payment.paymentDetails.map(async (paymentDetail) => {
            if (!paymentDetail.foodId) return null;

            const food = await getFoodByIdService(paymentDetail.foodId);
            return {
              ...food.data,
              quantity: paymentDetail?.foodQuantity,
            };
          })
        );

        const allNull = foods.every((food) => food === null);

        setSelectedFoods(allNull ? [] : foods);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVoucher = async () => {
      try {
        const res = await getVoucherByIdService(payment.voucherId);

        if (res.success) {
          setVoucher(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (payment) {
      fetchSelectedSeats();
      fetchSelectedFoods();
      fetchVoucher();
    }
  }, [payment]);

  useEffect(() => {
    const calculatePointUsed = () => {
      if (!payment) return 0;

      let totalPrice =
        voucher != null
          ? payment.totalPrice - payment.totalPrice * (voucher.Discount / 100.0)
          : payment.totalPrice;

      totalPrice -= payment.paymentDetails.reduce(
        (total, paymentDetail) => total + paymentDetail.price,
        0
      );

      const point = (totalPrice * 100) / 100000;
      const discount = (point * 100000) / 100;

      return {
        point,
        discount,
      };
    };

    if (payment) {
      setPoint(calculatePointUsed());
    }
  }, [payment, voucher]);

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

  return (
    <Modal opened={opened} onClose={close} title="Payment details">
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center">
          Movie: {payment?.schedule?.movieName}
        </div>
        <div className="flex items-center">
          Date: {formatDate(payment?.schedule?.date)}
        </div>

        <div className="flex flex-col mt-4">
          <h2 className="font-semibold mb-1">Payment information</h2>
          <div>
            {selectedSeats &&
              selectedSeats.length > 0 &&
              Object.values(groupSeatsByType(selectedSeats)).map(
                (seatGroup, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span>
                      {seatGroup?.quantity} Ghế {seatGroup?.type}
                    </span>
                    <span>
                      {formatCurrency(seatGroup?.quantity * seatGroup?.price)}đ
                    </span>
                  </div>
                )
              )}
            {selectedFoods &&
              selectedFoods.length > 0 &&
              selectedFoods.map((food) => {
                if (!food) return null;
                return (
                  <div
                    key={food?.id}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span>
                      {food?.quantity} {food?.name}
                    </span>
                    <span>{formatCurrency(food?.quantity * food?.price)}đ</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <h4 className="font-medium">Thông tin giảm giá</h4>
          <div className="flex justify-between py-2">
            <span>Mã khuyến mãi: {voucher?.code ?? "N/A"}</span>
            <span>{voucher?.discount ?? 0}%</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Điểm sử dụng: {point?.point}</span>
            <span>{point?.discount}đ</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <h1 className="font-semibold">Total</h1>
          <span className="text-red-500 text-lg">
            {formatCurrency(payment?.totalPrice)}đ
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDetailModal;
