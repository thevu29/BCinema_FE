import { ScrollArea, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../../context/Auth/authContext";
import { formatDate } from "../../../../utils/date";
import { formatCurrency } from "../../../../utils/currency";
import { getPaymentsService } from "../../../../services/paymentService";
import { getMovieByIdService } from "../../../../services/movieService";
import { getSeatScheduleById } from "../../../../services/seatScheduleService";
import { getFoodByIdService } from "../../../../services/foodService";
import clsx from "clsx";
import { getVoucherByIdService } from "../../../../services/voucherService";

const AccountPayment = () => {
  const { token } = useAuth();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [movie, setMovie] = useState(null);
  const [voucher, setVoucher] = useState(null);
  const [point, setPoint] = useState({
    point: 0,
    discount: 0,
  });
  const [hasInitialData, setHasInitialData] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);

  const fetchPayments = useCallback(async ({ token, search }) => {
    try {
      const user = jwtDecode(token);

      const res = await getPaymentsService({
        search,
        userId: user?.id,
        size: 99,
      });

      if (res.success) {
        setPayments(res.data);
        setSelectedPayment(res.data[0]);

        if (!search) {
          setHasInitialData(res.data.length > 0);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const params = new URLSearchParams(location.search);

      const search = params.get("search") || "";

      fetchPayments({ search, token });
    }
  }, [token, fetchPayments, location.search]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await getMovieByIdService(selectedPayment?.movieId);

        if (res.success) {
          setMovie(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSeatSchedules = async () => {
      const seatSchedules = await Promise.all(
        selectedPayment.paymentDetails.map(async (paymentDetail) => {
          if (!paymentDetail.seatScheduleId) return null;

          const seat = await getSeatScheduleById(paymentDetail.seatScheduleId);
          return seat.data;
        })
      );

      const allNull = seatSchedules.every((seat) => seat === null);

      setSelectedSeats(
        allNull ? [] : seatSchedules.filter((seat) => seat !== null)
      );
    };

    const fetchFoods = async () => {
      const foods = await Promise.all(
        selectedPayment.paymentDetails.map(async (paymentDetail) => {
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
    };

    const fetchVoucher = async () => {
      try {
        if (!selectedPayment?.voucherId) return;

        const res = await getVoucherByIdService(selectedPayment.voucherId);

        if (res.success) {
          setVoucher(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedPayment) {
      fetchMovie();
      fetchSeatSchedules();
      fetchFoods();
      fetchVoucher();
    }
  }, [selectedPayment]);

  useEffect(() => {
    const calculatePointUsed = () => {
      if (!selectedPayment) return 0;

      let totalPrice =
        voucher != null
          ? selectedPayment.totalPrice -
            selectedPayment.totalPrice * (voucher.Discount / 100.0)
          : selectedPayment.totalPrice;

      totalPrice -= selectedPayment.paymentDetails.reduce(
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

    if (selectedPayment) {
      setPoint(calculatePointUsed());
    }
  }, [selectedPayment, voucher]);

  const handleSearch = useDebouncedCallback((search) => {
    const params = new URLSearchParams(location.search);

    params.set("search", search);
    params.delete("page");

    if (!search) params.delete("search");

    navigate(`${pathname}?${params.toString()}`);
  }, 300);

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

  const calculateBonusPoint = (totalPrice) => {
    return Math.floor(totalPrice / 10000);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2 p-4 md:px-0">
        <h1 className="text-xl font-bold">Lịch sử đặt vé</h1>
      </div>
      <div className="bg-gray-100 grid md:grid-cols-10 md:rounded-lg md:gap-px">
        <div className="bg-white flex flex-col md:col-span-4 md:rounded-tl-lg md:rounded-bl-lg overflow-hidden">
          {(hasInitialData || location.search.includes("search")) && (
            <div className="p-4">
              <TextInput
                placeholder="Tên phim, mã khuyến mãi,..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}

          <ScrollArea.Autosize mah={450}>
            {payments &&
              payments.length > 0 &&
              payments.map((payment) => (
                <div
                  key={payment?.id}
                  className={clsx("p-4 cursor-pointer", {
                    "bg-gray-50": selectedPayment?.id === payment?.id,
                  })}
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="flex justify-between">
                    <div className="flex flex-1 flex-col">
                      <p className="text-gray-600 text-sm font-semibold">
                        {payment?.userName}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {formatDate(payment?.date)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-600">
                        {formatCurrency(payment?.totalPrice)}đ
                      </div>
                      <div className="text-xs text-green-600">
                        {payment?.totalPrice > 100000 &&
                          `+${calculateBonusPoint(payment?.totalPrice)}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </ScrollArea.Autosize>
        </div>

        {payments && payments.length === 0 && (
          <div className="text-center md:col-span-10 text-xl">
            Chưa từng đặt vé
          </div>
        )}

        {movie && selectedPayment && (
          <div className="bg-white md:col-span-6 md:rounded-r-lg overflow-hidden space-y-4 pt-4">
            <div className="file:first-letter:px-4 lg:px-6 flex flex-col md:flex-row gap-4 flex-wrap justify-center items-center">
              <img
                className="bg-gray-50 w-16 h-16"
                src={`http://image.tmdb.org/t/p/w500${movie?.posterPath}`}
                alt={movie?.title}
              />
              <div className="text-center md:text-left flex-1">
                <h3 className="text-base font-medium">{movie?.title}</h3>
              </div>
            </div>

            <ScrollArea.Autosize mah={450}>
              <div className="px-4 lg:p-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Thông tin thanh toán</h4>
                  {selectedSeats &&
                    selectedSeats.length > 0 &&
                    Object.values(groupSeatsByType(selectedSeats)).map(
                      (seatGroup, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <span>
                            {seatGroup?.quantity} Ghế {seatGroup?.type}
                          </span>
                          <span>
                            {formatCurrency(
                              seatGroup?.quantity * seatGroup?.price
                            )}
                            đ
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
                          className="flex justify-between py-2"
                        >
                          <span>
                            {food?.quantity} {food?.name}
                          </span>
                          <span>
                            {formatCurrency(food?.quantity * food?.price)}đ
                          </span>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-6 space-y-3">
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
              </div>
            </ScrollArea.Autosize>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountPayment;
