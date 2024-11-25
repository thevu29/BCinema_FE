import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { getAllRoomsService } from "../../../../services/roomService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import MovieSelect from "../../Movie/MovieSelect";
import MultiDatePicker from "../../DateTime/MultiDatePicker";
import { showNotification } from "../../../../utils/notification";
import { autoAddScheduleService } from "../../../../services/scheduleService";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Auto create" },
];

const FORM_VALIDATION = {
  movieId: {
    required: "Movie is required",
  },
  roomId: {
    required: "Room is required",
  },
  dates: {
    required: "Dates is required",
  },
  amount: {
    required: "Amount is required",
    min: { value: 1, message: "Amount must be greater than 0" },
  },
  status: {
    required: "Status is required",
  },
};

const status = [
  { value: "Available", label: "Available" },
  { value: "Ended", label: "Ended" },
  { value: "Cancelled", label: "Cancelled" },
];

const AutoCreateScheduleForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getAllRoomsService();

        if (res.success) {
          const data = res.data.map((room) => ({
            value: room.id,
            label: room.name,
          }));

          setRooms(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRooms();
  }, []);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      movieId: "",
      roomId: "",
      dates: "",
      amount: "",
      status: "Available",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await autoAddScheduleService(data);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/schedules");
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
        Auto create schedule
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow gap={60}>
            <MovieSelect control={control} FORM_VALIDATION={FORM_VALIDATION} />

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
                  searchable
                />
              )}
            />
          </Group>
          <Group grow gap={60} mt={24}>
            <Controller
              name="amount"
              control={control}
              rules={FORM_VALIDATION.amount}
              render={({ field, fieldState: { error } }) => (
                <NumberInput
                  {...field}
                  error={error?.message}
                  label="Amount"
                  size="md"
                  placeholder="Enter schedule amount"
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              rules={FORM_VALIDATION.status}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  error={error?.message}
                  label="Status"
                  size="md"
                  placeholder="Select status"
                  data={status}
                />
              )}
            />
          </Group>

          <Group grow mt={24}>
            <Flex direction="column">
              <label htmlFor="dates">Dates:</label>
              <MultiDatePicker
                FORM_VALIDATION={FORM_VALIDATION}
                control={control}
              />
            </Flex>
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/schedules">
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

export default AutoCreateScheduleForm;
