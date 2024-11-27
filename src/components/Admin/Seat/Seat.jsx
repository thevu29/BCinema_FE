import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import { Button, Group, Select, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getSeatsInRoomService } from "../../../services/seatService";
import { getAllRoomsService } from "../../../services/roomService";
import { showNotification } from "../../../utils/notification";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import SeatList from "./SeatList";
import UpdateSeatModal from "./Modal/UpdateSeatModal";

const breadcumbData = [{ title: "Admin", href: "/admin" }, { title: "Seats" }];

const Seat = () => {
  const location = useLocation();
  const roomFromState = location.state?.room;

  const initialRoomValue = roomFromState
    ? { value: roomFromState.id, label: roomFromState.name }
    : null;

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSeletedSeats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(initialRoomValue);

  const [opened, { open, close }] = useDisclosure();

  const fetchSeats = async (roomId) => {
    try {
      const res = await getSeatsInRoomService(roomId);

      if (res.success) {
        setSeats(res.data);
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getAllRoomsService();
        if (res.success) {
          const formattedRooms = res.data.map((room) => ({
            value: room.id,
            label: room.name,
          }));

          setRooms(formattedRooms);
        } else {
          showNotification(res.message, "Error");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0]);
    }
  }, [rooms, selectedRoom]);

  useEffect(() => {
    if (selectedRoom) {
      fetchSeats(selectedRoom.value);
    }
  }, [selectedRoom]);

  const handleRoomChange = (value) => {
    const selected = rooms.find((room) => room.value === value);
    setSelectedRoom(selected);
  };

  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Seats
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb="60px">
          <Select
            searchable
            allowDeselect={false}
            data={rooms}
            defaultValue={selectedRoom}
            value={selectedRoom?.value}
            onChange={(value) => handleRoomChange(value)}
          />

          <Group>
            {selectedSeats.length > 0 && (
              <Button variant="light" color="yellow" radius="md" onClick={open}>
                <IconEdit width={18} height={18} />
              </Button>
            )}

            <Link to="/admin/seats/create" state={{ room: selectedRoom }}>
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create seat
              </Button>
            </Link>
          </Group>
        </Group>

        <SeatList
          seats={seats}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSeletedSeats}
        />
      </div>

      <UpdateSeatModal
        opened={opened}
        close={close}
        selectedSeats={selectedSeats}
        setSeletedSeats={setSeletedSeats}
        fetchSeats={fetchSeats}
        selectedRoom={selectedRoom}
      />
    </>
  );
};

export default Seat;
