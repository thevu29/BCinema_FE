import {
  BackgroundImage,
  Box,
  Center,
  Group,
  Text,
  Title,
  Tooltip,
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
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Seat schedules" },
];

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

const getSeatImage = (status, type) => {
  const lowerStatus = status.toLowerCase();
  const lowerType = type.toLowerCase();
  return (
    (seatImages[lowerStatus] && seatImages[lowerStatus][lowerType]) ||
    seatImages.default[lowerType]
  );
};

const SeatSchedule = () => {
  const { scheduleId } = useParams();

  const [seats, setSeats] = useState([]);

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
  }, [scheduleId]);

  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Schedule&apos;s seats
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <img src={ScreenImage} />

        <div>
          {Object.entries(seats).map(([row, data]) => (
            <Group key={row} grow mb="md">
              {data.map((seat) => (
                <Tooltip
                  key={seat.id}
                  label={`${seat.seatType} - ${seat.price}`}
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
    </>
  );
};

export default SeatSchedule;
