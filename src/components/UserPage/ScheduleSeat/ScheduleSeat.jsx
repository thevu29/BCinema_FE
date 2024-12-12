import {
  BackgroundImage,
  Box,
  Center,
  Group,
  Text,
  Title,
  Tooltip,
  Button,
} from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSeatSchedulesByScheduleId } from "../../../services/seatScheduleService";
import { getScheduleByIdService } from "../../../services/scheduleService";
import { getMovieByIdService } from "../../../services/movieService";
import { formatDate, getTime } from "../../../utils/date";
import { showNotification } from "../../../utils/notification";
import ScreenImage from "../../../assets/images/ic-screen.png";
import SeatRegular from "../../../assets/images/seats/seat-regular.png";
import SeatBookRegular from "../../../assets/images/seats/seat-book-regular.png";
import SeatBuyRegular from "../../../assets/images/seats/seat-buy-regular.png";
import SeatProcessRegular from "../../../assets/images/seats/seat-process-regular.png";
import SeatVip from "../../../assets/images/seats/seat-vip.png";
import SeatBookVip from "../../../assets/images/seats/seat-book-vip.png";
import SeatBuyVip from "../../../assets/images/seats/seat-buy-vip.png";
import SeatProcessVip from "../../../assets/images/seats/seat-process-vip.png";
import SeatDouble from "../../../assets/images/seats/seat-double.png";
import SeatBookDouble from "../../../assets/images/seats/seat-book-double.png";
import SeatBuyDouble from "../../../assets/images/seats/seat-buy-double.png";
import SeatProcessDouble from "../../../assets/images/seats/seat-process-double.png";
import SeatSelectRegular from "../../../assets/images/seats/seat-select-regular.png";
import SeatSelectVip from "../../../assets/images/seats/seat-select-vip.png";
import SeatSelectDouble from "../../../assets/images/seats/seat-select-double.png";

const seatImages = {
  booked: {
    regular: SeatBookRegular,
    vip: SeatBookVip,
    double: SeatBookDouble,
  },
  bought: {
    regular: SeatBuyRegular,
    vip: SeatBuyVip,
    double: SeatBuyDouble,
  },
  process: {
    regular: SeatProcessRegular,
    vip: SeatProcessVip,
    double: SeatProcessDouble,
  },
  default: {
    regular: SeatRegular,
    vip: SeatVip,
    double: SeatDouble,
  },
  select: {
    regular: SeatSelectRegular,
    vip: SeatSelectVip,
    double: SeatSelectDouble,
  },
};

const getSeatImage = (status, type) => {
  const lowerStatus = status.toLowerCase();
  const lowerType = type.toLowerCase();
  return (
    (seatImages[lowerStatus] && seatImages[lowerStatus][lowerType]) ||
    seatImages.default[lowerType]
  );
};

const ScheduleSeat = () => {
  const navigate = useNavigate();

  const { scheduleId } = useParams();

  const [movie, setMovie] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const fetchScheduleById = async (Id) => {
    try {
      const res = await getScheduleByIdService(Id);

      if (res.success) {
        setSchedule(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMovieById = async (movieId) => {
    try {
      const res = await getMovieByIdService(movieId);

      if (res.success) {
        setMovie(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSeatSchedules = async () => {
      try {
        const res = await getSeatSchedulesByScheduleId(scheduleId);

        if (res.success) {
          const groupedSeats = res.data.reduce((acc, item) => {
            acc[item.row] = acc[item.row] || [];
            acc[item.row].push(item);
            return acc;
          }, {});

          setSeats(groupedSeats);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSeatSchedules();
    fetchScheduleById(scheduleId);
  }, [scheduleId]);

  useEffect(() => {
    if (schedule && schedule.movieId) {
      fetchMovieById(schedule.movieId);
    }
  }, [schedule]);

  const handleSelectSeat = (seat) => {
    const seatIndex = selectedSeats.findIndex((s) => s.id === seat.id);

    if (seatIndex === -1) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      const newSelectedSeats = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(newSelectedSeats);
    }
  };

  const getSeatNameById = (idSeat) => {
    for (const row of Object.values(seats)) {
      const seat = row.find((seat) => seat === idSeat);
      if (seat) {
        return `${seat.row}${seat.number}`;
      }
    }
    return "Unknown";
  };

  const getTotalPrice = () => {
    const totalPrice = selectedSeats.reduce((total, seatId) => {
      for (const row of Object.values(seats)) {
        const seat = row.find((seat) => seat === seatId);
        if (seat) {
          return total + seat.price;
        }
      }
      return total;
    }, 0);

    return totalPrice.toLocaleString("vi-VN");
  };

  const handleSelectFood = (schedule) => {
    if (selectedSeats && selectedSeats.length <= 0) {
      showNotification("Vui lòng chọn ghế ngồi", "Warning");
      return;
    }

    navigate(`/schedules/${schedule.id}/foods`, {
      state: { selectedSeats },
    });
  };

  return (
    <>
      <LoadingOverlay
        zIndex={1000}
        visible={seats.length === 0}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <div className="bg-slate-100 flex justify-center py-5">
        <div className="bg-slate-100 ps-10 pe-10 rounded-lg w-[1000px]">
          <Title order={1} mt={32} className="pb-10">
            Đặt vé xem phim
          </Title>

          <img src={ScreenImage} />

          <div>
            {Object.entries(seats)
              .sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
              .map(([row, data]) => (
                <Group key={row} grow mb="md">
                  {data
                    .sort((a, b) => a.number - b.number)
                    .map((seat) => {
                      const isSelect = selectedSeats.find(
                        (s) => s.id === seat.id
                      );

                      const seatStatus = isSelect
                        ? "select"
                        : seat.status || "default";

                      const image = getSeatImage(seatStatus, seat.seatType);

                      return (
                        <Tooltip
                          key={seat.id}
                          label={`${seat.seatType} - ${seat.price}`}
                        >
                          <Box
                            className="cursor-pointer"
                            onClick={() => handleSelectSeat(seat)}
                          >
                            <BackgroundImage
                              src={image}
                              style={{
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                              }}
                            >
                              <Center p="sm">
                                <Text
                                  c={isSelect ? "white" : "black"}
                                  fw="bold"
                                  size="xs"
                                >
                                  {seat.row}
                                  {seat.number}
                                </Text>
                              </Center>
                            </BackgroundImage>
                          </Box>
                        </Tooltip>
                      );
                    })}
                </Group>
              ))}
          </div>

          <Group mt="60px" justify="center" gap={60}>
            <Group>
              <div className="flex flex-col items-center">
                <img src={SeatRegular} className="w-[40px]" />
                <Text c="black" size="sm">
                  Regular
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <img src={SeatVip} className="w-[40px]" />
                <Text c="black" size="sm">
                  Vip
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <img src={SeatDouble} className="w-[40px]" />
                <Text c="black" size="sm">
                  Double
                </Text>
              </div>
            </Group>
            <Group>
              <div className="flex flex-col items-center">
                <div className="size-8 bg-[#babbc3]"></div>
                <Text c="black" size="sm">
                  Có thể chọn
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <div className="size-8 bg-[#03599d]"></div>
                <Text c="black" size="sm">
                  Đang chọn
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <div className="size-8 bg-[#fd2802]"></div>
                <Text c="black" size="sm">
                  Đã được đặt
                </Text>
              </div>
            </Group>
          </Group>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col justify-center bg-white rounded-xl shadow-md py-10">
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
                  {selectedSeats.map(getSeatNameById).join(", ")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng giá:</span>
                <span className="font-bold text-green-600">
                  {getTotalPrice()} VND
                </span>
              </div>
            </div>

            <div className="p-4">
              <Button fullWidth onClick={() => handleSelectFood(schedule)}>
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleSeat;
