import { Button, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { addSeatTypeService } from "../../../../services/seatTypeService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Seat types", href: "/admin/seat-types" },
  { title: "Create seat type" },
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

const CreateSeatTypeForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      price: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await addSeatTypeService(data);

      if (response.success) {
        showNotification(response.message, "Success");
        navigate("/admin/seat-types");
      } else {
        showNotification(response.message, "Error");
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
        Create seat type
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

export default CreateSeatTypeForm;
