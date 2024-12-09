import { Divider, Group, Image, Text, Title, Button } from "@mantine/core";

import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSeatSchedulesByScheduleId } from "../../../services/seatScheduleService";
import { getScheduleByIdService } from "../../../services/scheduleService";
import { getMovieByIdService } from "../../../services/movieService";
import { formatDate, getTime } from "../../../utils/date";
import FoodList from "./FoodList";

const PaymentAndOrder = () => {
  const location = useLocation();
  const state = location?.state;
  const selectedSeats = state?.selectedSeats || [];

  const { scheduleId } = useParams();

  const [movie, setMovie] = useState({});
  const [schedule, setSchedule] = useState({});
  const [seats, setSeats] = useState(selectedSeats);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerInfo] = useState({
    name: "Cường",
    email: "cuong@gmail.com",
    phone: "0831231231",
  });

  const fetchScheduleById = async (Id) => {
    try {
      const res = await getScheduleByIdService(Id);
      if (res.success) {
        setSchedule(res.data);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const fetchMovieById = async (movieId) => {
    if (!movieId) return;
    try {
      const res = await getMovieByIdService(movieId);
      if (res.success) {
        setMovie(res.data);
      }
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

  // const fetchSeatSchedules = async () => {
  //   try {
  //     const res = await getSeatSchedulesByScheduleId(scheduleId);
  //     if (res.success) {
  //       const groupedSeats = res.data.reduce((acc, item) => {
  //         acc[item.row] = acc[item.row] || [];
  //         acc[item.row].push(item);
  //         return acc;
  //       }, {});
  //       setSeats(groupedSeats);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching seats:", error);
  //   }
  // };

  useEffect(() => {
    fetchScheduleById(scheduleId);
    // fetchSeatSchedules();
  }, [scheduleId]);

  useEffect(() => {
    if (schedule.movieId) {
      fetchMovieById(schedule.movieId);
    }
  }, [schedule]);

  useEffect(() => {
    console.log(seats);
    if (!seats || seats.length === 0) return;

    const price = seats.reduce((total, row) => total + row.price, 0);
    setTotalPrice(price);
  }, [seats]);

  const getSeatNameById = () => {
    
  };

  return (
    <>
      <div className="bg-slate-100 flex flex-row justify-center">
        <div className="bg-slate-100 ps-10 pe-10 rounded-lg w-[1000px]">
          <Title order={1} mt={32} className="pb-10">
            Thanh toán và thông tin đặt vé
          </Title>

          <div className="w-[800px] p-5">
            <h1 className="text-2xl font-bold mb-4">Thông tin thanh toán</h1>

            <Group position="apart" align="center">
              <Group spacing="xl">
                <Text size="lg" weight={500}>
                  Họ Tên:
                </Text>
                <Text size="lg">{customerInfo.name}</Text>
              </Group>
              <Group spacing="xl">
                <Text size="lg" weight={500}>
                  Email:
                </Text>
                <Text size="lg">{customerInfo.email}</Text>
              </Group>
              <Group spacing="xl">
                <Text size="lg" weight={500}>
                  Số Điện Thoại:
                </Text>
                <Text size="lg">{customerInfo.phone}</Text>
              </Group>
            </Group>

            <Divider my="md" variant="dashed" className="w-[100%]" />

            <Group
              mt="30px"
              align="center"
              className="flex flex-col items-start"
            >
              <div className="w-full">
                <FoodList />
              </div>
            </Group>
          </div>
        </div>

        <div className="w-96 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex items-center p-4 border-b border-gray-200">
            <img
              src={`http://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              className="w-24 h-36 object-cover rounded-md mr-4"
            />
            <h2 className="text-xl font-bold text-blue-600 truncate">
              {movie.title}
            </h2>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Thời lượng:</span>
              <span className="font-medium">{movie.runtime} phút</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Ngày chiếu:</span>
              <span className="font-medium">{formatDate(schedule.date)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Giờ chiếu:</span>
              <span className="font-medium">{getTime(schedule.date)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Phòng chiếu:</span>
              <span className="font-medium">{schedule.roomName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Ghế ngồi:</span>
              <span className="font-medium">
                {seats &&
                  seats.length > 0 &&
                  seats.map((seat) => `${seat?.row}${seat?.number}`).join(", ")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng giá:</span>
              <span className="font-bold text-green-600">{totalPrice} VND</span>
            </div>
          </div>

          <div className="p-4">
            <Button fullWidth>Tiếp tục</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentAndOrder;
