import { Button, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import {
  getSeatTypeByIdService,
  updateSeatTypeService,
} from "../../../../services/seatTypeService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Seat types", href: "/admin/seat-types" },
  { title: "Update seat type" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
  price: {
    required: "Price is required",
    min: {
      value: 1,
      message: "Price must be at least 1",
    },
  },
};

const UpdateSeatTypeForm = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      price: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSeatTypeByIdService(id);
        if (res.success) {
          const seatType = res.data;

          reset({
            name: seatType.name,
            price: seatType.price,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await updateSeatTypeService(id, data);

      res.success
        ? showNotification(res.message, "Success")
        : showNotification(res.message, "Error");
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
        Update seat type
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
                placeholder="Enter seat type name"
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={FORM_VALIDATION.price}
            render={({ field, fieldState: { error } }) => (
              <TextInput
                {...field}
                error={error?.message}
                mt="xl"
                label="Price"
                size="md"
                type="number"
                placeholder="Enter seat type price"
              />
            )}
          />

          <Group mt={32} justify="flex-end">
            <Link to="/admin/seat-types">
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

export default UpdateSeatTypeForm;
