import { Button, Group, LoadingOverlay, Select, Title } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import {
  getScheduleByIdService,
  updateScheduleService,
} from "../../../../services/scheduleService";
import { getAllRoomsService } from "../../../../services/roomService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import moment from "moment-timezone";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Update schedule", href: "/admin/schedules/update" },
];

const FORM_VALIDATION = {
  roomId: {
    required: "Room is required",
  },
  date: {
    required: "Date is required",
  },
  time: {
    required: "Time is required",
  },
  status: {
    required: "Status is required",
  },
};

const UpdateScheduleForm = () => {
  const { id } = useParams();

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
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

    const fetchData = async () => {
      try {
        const res = await getScheduleByIdService(id);
        if (res.success) {
          const schedule = res.data;

          const date = moment(schedule.date).subtract(7, "hours").toDate();

          reset({
            roomId: schedule.roomId,
            date: date,
            status: schedule.status,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRooms();
    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await updateScheduleService(id, data);

      if (res.success) {
        showNotification(res.message, "Success");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log("Error updating schedule:", error);
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
        Update schedule
      </Title>
      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow gap={24}>
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
            <Controller
              name="date"
              control={control}
              rules={FORM_VALIDATION.date}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  valueFormat="DD/MM/YYYY HH:mm"
                  {...field}
                  error={error?.message}
                  label="Date"
                  size="md"
                  placeholder="Enter date time"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Group>
          <Group mt={24}>
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
            <Link to="/admin/Schedules">
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

export default UpdateScheduleForm;
