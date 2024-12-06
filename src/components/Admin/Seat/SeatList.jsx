import {
  BackgroundImage,
  Box,
  Center,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import ScreenImage from "../../../assets/images/ic-screen.png";
import SeatRegular from "../../../assets/images/seats/seat-regular.png";
import SeatVip from "../../../assets/images/seats/seat-vip.png";
import SeatDouble from "../../../assets/images/seats/seat-double.png";
import SeatSelectRegular from "../../../assets/images/seats/seat-select-regular.png";
import SeatSelectVip from "../../../assets/images/seats/seat-select-vip.png";
import SeatSelectDouble from "../../../assets/images/seats/seat-select-double.png";

const SeatList = ({ seats, selectedSeats, setSelectedSeats }) => {
  const groupedSeats = seats.reduce((acc, item) => {
    acc[item.row] = acc[item.row] || [];
    acc[item.row].push(item);
    return acc;
  }, {});

  const handleSelectSeat = (seat) => {
    const seatIndex = selectedSeats.findIndex((s) => s.id === seat.id);

    if (seatIndex === -1) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      const newSelectedSeats = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(newSelectedSeats);
    }
  };

  console.log(selectedSeats);
  

  return (
    <>
      <img src={ScreenImage} />

      <div>
        {Object.entries(groupedSeats).map(([row, seats]) => (
          <Group key={row} grow mb="md">
            {seats.map((seat) => {
              let image;

              switch (seat.seatType.toLowerCase()) {
                case "regular":
                  image = SeatRegular;
                  break;
                case "vip":
                  image = SeatVip;
                  break;
                case "double":
                  image = SeatDouble;
                  break;
              }

              const isSelect = selectedSeats.find((s) => s.id === seat.id);

              if (isSelect) {
                switch (seat.seatType.toLowerCase()) {
                  case "regular":
                    image = SeatSelectRegular;
                    break;
                  case "vip":
                    image = SeatSelectVip;
                    break;
                  case "double":
                    image = SeatSelectDouble;
                    break;
                }
              }

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
    </>
  );
};

export default SeatList;
