import { Button, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import {
  getRoomByIdService,
  updateRoomService,
} from "../../../../services/roomService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Rooms", href: "/admin/rooms" },
  { title: "Update room", href: "/admin/rooms/update" },
];

const FORM_VALIDATION = {
  name: {
    required: "Room name is required",
  },
};

const UpdateRoomForm = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRoomByIdService(id);
        if (res.success) {
          const room = res.data;

          reset({
            name: room.name,
            description: room.description,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await updateRoomService(id, data);

      if (res.success) {
        showNotification(res.message, "Success");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.error("Error updating room:", error);
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
        Update Room
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                mt="md"
                placeholder="Enter room description"
              />
            )}
          />
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

export default UpdateRoomForm;
