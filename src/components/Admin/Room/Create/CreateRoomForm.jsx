import { Button, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { showNotification } from "../../../../utils/notification";
import { addRoomService } from "../../../../services/roomService";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Rooms", href: "/admin/rooms" },
  { title: "Create room" },
];

const FORM_VALIDATION = {
  name: {
    required: "Room name is required",
  },
  seatRows: {
    required: "Seat rows are required",
    min: {
      value: 1,
      message: "Seat rows must be at least 1",
    },
  },
  seatColumns: {
    required: "Seat columns are required",
    min: {
      value: 1,
      message: "Seat columns must be at least 1",
    },
  },
};

const CreateRoomForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      description: "",
      seatRows: "",
      seatColumns: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await addRoomService(data);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/rooms");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
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
        Create Room
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow gap={60}>
            <Controller
              name="name"
              control={control}
              rules={FORM_VALIDATION.name}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Name"
                  size="md"
                  placeholder="Enter room name"
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Description"
                  size="md"
                  placeholder="Enter room description"
                />
              )}
            />
          </Group>
          <Group grow gap={60} mt={24}>
            <Controller
              name="seatRows"
              control={control}
              rules={FORM_VALIDATION.seatRows}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Seat Rows"
                  type="number"
                  size="md"
                  placeholder="Enter the number of seats in a row"
                />
              )}
            />
            <Controller
              name="seatColumns"
              control={control}
              rules={FORM_VALIDATION.seatColumns}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Seat Columns"
                  type="number"
                  size="md"
                  placeholder="Enter the number of seats in the column"
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

export default CreateRoomForm;
