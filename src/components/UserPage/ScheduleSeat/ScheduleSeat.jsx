import {
  BackgroundImage,
  Box,
  Center,
  Divider,
  Group,
  Image,
  Text,
  Title,
  Tooltip,
  Button
} from "@mantine/core";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSeatSchedulesByScheduleId } from "../../../services/seatScheduleService";

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
import { getScheduleByIdService } from "../../../services/scheduleService";
import { getMovieByIdService } from "../../../services/movieService";
import { formatDate, getTime } from "../../../utils/date";

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
};

const ScheduleSeat = () => {
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
      console.error(error);
    }
  };

  const fetchMovieById = async (movieId) => {
    try {
      const res = await getMovieByIdService(movieId);

      if (res.success) {
        setMovie(res.data);
      }
    } catch (error) {
      console.error(error);
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
        console.error(error);
      }
    };

    fetchSeatSchedules();
    fetchScheduleById(scheduleId);
  }, [scheduleId]);

  useEffect(() => {
    fetchMovieById(schedule.movieId);
  }, [schedule]);

  const getSeatImage = (status, type) => {
    const lowerStatus = status.toLowerCase();
    const lowerType = type.toLowerCase();
    return (
      (seatImages[lowerStatus] && seatImages[lowerStatus][lowerType]) ||
      seatImages.default[lowerType]
    );
  };

  const handleSelectSeat = (nameSeat) => {
    if (selectedSeats.includes(nameSeat)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== nameSeat));
      return;
    }
    setSelectedSeats([...selectedSeats, nameSeat]);
  };

  return (
    <>
      <div className="bg-slate-100 flex flex-row justify-center">
        <div className="bg-slate-100 ps-10 pe-10 rounded-lg w-[1000px]">
          <Title order={1} mt={32} className="pb-10">
            Schedule&apos;s seats
          </Title>

          <img src={ScreenImage} />

          <div>
            {Object.entries(seats).map(([row, data]) => (
              <Group key={row} grow mb="md">
                {data.map((seat) => (
                  <Tooltip
                    key={seat.id}
                    label={`${seat.seatType} - ${seat.price}`}
                    onClick={() => handleSelectSeat(seat.row + seat.number)}
                  >
                    <Box className="cursor-pointer">
                      <BackgroundImage
                        src={getSeatImage(seat.status, seat.seatType)}
                        style={{
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <Center p="sm">
                          <Text fw="bold" size="xs">
                            {seat.row}
                            {seat.number}
                          </Text>
                        </Center>
                      </BackgroundImage>
                    </Box>
                  </Tooltip>
                ))}
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
                  Available
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <div className="size-8 bg-[#fdca02]"></div>
                <Text c="black" size="sm">
                  Booked
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <div className="size-8 bg-[#fd2802]"></div>
                <Text c="black" size="sm">
                  Bought
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <div className="size-8 bg-[#3fb7f9]"></div>
                <Text c="black" size="sm">
                  Process
                </Text>
              </div>
            </Group>
          </Group>
        </div>
        <div className="w-[400px] flex flex-col items-center bg-white ">
          <div className="flex flex-row">
            <Image
              src={`http://image.tmdb.org/t/p/w500${movie.posterPath}`}
              className="h-72"
            />
            <p className="text-3xl p-5 text-blue-600">{movie.title}</p>
          </div>

          <Text size="md" mt="xs">
            Thời lượng: {movie.runtime} phút
          </Text>
          <Divider my="md" variant="dashed" className="w-[100%]"/>
          <Text size="md" mt="xs">
            Ngày chiếu: {formatDate(schedule.date)}
          </Text>
          <Text size="md" mt="xs">
            Giờ chiếu: {getTime(schedule.date)}
          </Text>
          <Text size="md" mt="xs">
            Phòng chiếu: {schedule.roomName}
          </Text>
          <Text size="md" mt="xs">
            Ghế ngồi: {selectedSeats.join(", ")}
          </Text>
          <Button mt={20}>Tiếp tục</Button>
        </div>
      </div>
    </>
  );
};

export default ScheduleSeat;
