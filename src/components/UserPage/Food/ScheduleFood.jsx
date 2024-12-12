import { Group, Text, Title, Button, Flex } from "@mantine/core";
import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { IconX } from "@tabler/icons-react";
import { getScheduleByIdService } from "../../../services/scheduleService";
import { getMovieByIdService } from "../../../services/movieService";
import { formatDate, getTime } from "../../../utils/date";
import { useAuth } from "../../../context/Auth/authContext";
import { formatCurrency } from "../../../utils/currency";
import FoodList from "./FoodList";

const ScheduleFood = () => {
  const { token } = useAuth();

  const location = useLocation();
  const state = location?.state;
  const selectedSeats = useMemo(() => state?.selectedSeats || [], [state]);

  const { scheduleId } = useParams();

  const [movie, setMovie] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);

  useEffect(() => {
    const fetchScheduleById = async (id) => {
      try {
        const res = await getScheduleByIdService(id);

        if (res.success) setSchedule(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (scheduleId) fetchScheduleById(scheduleId);
  }, [scheduleId]);

  useEffect(() => {
    const fetchMovieById = async (movieId) => {
      if (!movieId) return;
      try {
        const res = await getMovieByIdService(movieId);

        if (res.success) setMovie(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (schedule?.movieId) fetchMovieById(schedule.movieId);
  }, [schedule]);

  useEffect(() => {
    const price = selectedSeats.reduce((total, seat) => total + seat.price, 0);

    const foodPrice = selectedFoods.reduce(
      (total, food) => total + food.price * food.quantity,
      0
    );

    setTotalPrice(price + foodPrice);
  }, [selectedSeats, selectedFoods]);

  useEffect(() => {
    if (token) setUser(jwtDecode(token));
  }, [token]);

  const handleRemoveFood = (food) => {
    setSelectedFoods(selectedFoods.filter((item) => item.id !== food.id));
  };

  return (
    <>
      <div className="bg-slate-100 flex flex-row justify-center pb-10">
        <div className="bg-slate-100 ps-10 pe-10 w-[1000px]">
          <Title order={1} mt={32} className="pb-10">
            Chọn món ăn
          </Title>

          <div className="bg-white rounded-xl p-5">
            <h1 className="text-2xl font-bold mb-4">Thông tin thanh toán</h1>

            <Group align="center" gap={48}>
              <Text size="md">Họ Tên: {user?.name}</Text>
              <Text size="md">Email: {user?.email}</Text>
            </Group>
            
            {selectedFoods && selectedFoods.length > 0 && (
              <Group mt={24}>
                <Text size="md">Món ăn:</Text>
                {selectedFoods.map((food) => (
                  <Flex wrap="wrap" key={food.id}>
                    <div className="text-xs p-2 bg-slate-100 rounded-full flex items-center gap-1">
                      <span>
                        {food?.quantity} {food?.name}
                      </span>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleRemoveFood(food)}
                      >
                        <IconX size={12} />
                      </div>
                    </div>
                  </Flex>
                ))}
              </Group>
            )}
          </div>

          <Group
            mt="30px"
            align="center"
            className="flex flex-col items-start bg-white rounded-xl p-5"
          >
            <div className="w-full">
              <FoodList
                selectedFoods={selectedFoods}
                setSelectedFoods={setSelectedFoods}
              />
            </div>
          </Group>
        </div>

        <div className="flex items-center">
          <div className="flex flex-col justify-center bg-white rounded-xl shadow-md py-10">
            <div className="flex items-center p-4 border-b border-gray-200">
              <img
                src={`http://image.tmdb.org/t/p/w500${movie?.posterPath}`}
                alt={movie?.title}
                className="w-24 h-36 object-cover rounded-md mr-4"
              />
              <h2 className="text-xl font-bold text-blue-600 truncate">
                {movie?.title}
              </h2>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Thời lượng:</span>
                <span className="font-medium">{movie?.runtime} phút</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Ngày chiếu:</span>
                <span className="font-medium">
                  {formatDate(schedule?.date)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Giờ chiếu:</span>
                <span className="font-medium">{getTime(schedule?.date)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Phòng chiếu:</span>
                <span className="font-medium">{schedule?.roomName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Ghế ngồi:</span>
                <span className="font-medium">
                  {selectedSeats &&
                    selectedSeats.length > 0 &&
                    selectedSeats
                      .map((seat) => `${seat?.row}${seat?.number}`)
                      .join(", ")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng giá:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(totalPrice)} VND
                </span>
              </div>
            </div>
            <div className="p-4">
              <Link
                to={`/schedules/${schedule?.id}/payments`}
                state={{ selectedSeats, selectedFoods }}
              >
                <Button fullWidth>Tiếp tục</Button>

              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleFood;
