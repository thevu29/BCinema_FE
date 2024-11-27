import { Button, Group, LoadingOverlay, Title, Select } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { addScheduleService } from "../../../../services/scheduleService";
import { getAllRoomsService } from "../../../../services/roomService";
import moment from "moment-timezone";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import MovieSelect from "../../Movie/MovieSelect";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Create schedule" },
];

const FORM_VALIDATION = {
  movieId: {
    required: "Movie is required",
  },
  roomId: {
    required: "Room is required",
  },
  date: {
    required: "Date is required",
  },
  status: {
    required: "Status is required",
  },
};

const CreateScheduleForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      movieId: "",
      roomId: "",
      date: "",
      status: "Available",
    },
    mode: "onChange",
  });

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const scheduleData = {
        ...data,
        date: moment(data.date).format("YYYY-MM-DD HH:mm"),
      };

      const res = await addScheduleService(scheduleData);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/schedules");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occured", "Error");
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
        Create Schedule
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
              name="date"
              control={control}
              rules={FORM_VALIDATION.date}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  {...field}
                  valueFormat="DD/MM/YYYY HH:mm"
                  error={error?.message}
                  label="Date"
                  size="md"
                  placeholder="Enter date time"
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
                  data={[
                    { value: "Available", label: "Available" },
                    { value: "Ended", label: "Ended" },
                    { value: "Cancelled", label: "Cancelled" },
                  ]}
                />
              )}
            />
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

export default CreateScheduleForm;
