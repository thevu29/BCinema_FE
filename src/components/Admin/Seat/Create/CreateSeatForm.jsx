import {
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { addSeatService } from "../../../../services/seatService";
import { getAllRoomsService } from "../../../../services/roomService";
import { getAllSeatTypesService } from "../../../../services/seatTypeService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Seats", href: "/admin/seats" },
  { title: "Create seat" },
];

const FORM_VALIDATION = {
  row: {
    required: "Row is required",
  },
  number: {
    required: "Seat number is required",
    min: {
      value: 1,
      message: "Seat number must be at least 1",
    },
  },
  seatTypeId: {
    required: "Seat type is required",
  },
  roomId: {
    required: "Room is required",
  },
};

const CreateSeatForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomFromState = location.state?.room;

  const [rooms, setRoom] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      row: "",
      number: "",
      seatTypeId: "",
      roomId: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (roomFromState?.value) {
      setValue("roomId", roomFromState.value);
    }
  }, [roomFromState, setValue]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getAllRoomsService();

        if (res.success) {
          const formattedRooms = res.data.map((room) => ({
            value: room.id,
            label: room.name,
          }));

          setRoom(formattedRooms);
        } else {
          showNotification(res.message, "Error");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSeatTypes = async () => {
      try {
        const res = await getAllSeatTypesService();

        if (res.success) {
          const formattedSeatTypes = res.data.map((seatType) => ({
            value: seatType.id,
            label: seatType.name,
          }));

          setSeatTypes(formattedSeatTypes);
        } else {
          showNotification(res.message, "Error");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoom();
    fetchSeatTypes();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await addSeatService(data);

      if (res.success) {
        showNotification(res.message, "Success");

        const room = rooms.find((room) => room.value === data.roomId);

        navigate("/admin/seats", {
          state: { room: { id: room.value, name: room.label } },
        });
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Create Seat
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow gap={60}>
            <Controller
              name="row"
              control={control}
              rules={FORM_VALIDATION.row}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Row"
                  size="md"
                  placeholder="Enter seat row"
                />
              )}
            />
            <Controller
              name="number"
              control={control}
              rules={FORM_VALIDATION.number}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Number"
                  type="number"
                  size="md"
                  placeholder="Enter seat number"
                />
              )}
            />
          </Group>

          <Group grow gap={60} mt={24}>
            <Controller
              name="seatTypeId"
              control={control}
              rules={FORM_VALIDATION.seatTypeId}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  error={error?.message}
                  label="Seat type"
                  size="md"
                  placeholder="Select seat type"
                  data={seatTypes}
                  allowDeselect={false}
                />
              )}
            />

            <Controller
              name="roomId"
              control={control}
              rules={FORM_VALIDATION.roomId}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  error={error?.message}
                  label="Room"
                  size="md"
                  placeholder="Select room"
                  data={rooms}
                  allowDeselect={false}
                />
              )}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/rooms">
              <Button variant="filled" color="gray">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="filled">
              Save
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
};

export default CreateSeatForm;
