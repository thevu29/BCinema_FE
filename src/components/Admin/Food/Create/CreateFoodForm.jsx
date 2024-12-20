import {
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
  Flex,
} from "@mantine/core";
import { useState } from "react";
import { addFoodService } from "../../../../services/foodService";
import { showNotification } from "../../../../utils/notification";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import ImageDropzone from "../../../Dropzone/ImageDropzone";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Foods", href: "/admin/foods" },
  { title: "Create food", href: "/admin/foods/create" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
  price: {
    required: "Price is required",
  },
  quantity: {
    required: "Quantity is required",
  },
};

const CreateFoodForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      image: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (!data.image) {
        showNotification("Image is required", "Error");
        return;
      }

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const res = await addFoodService(formData);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/foods");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    setValue("image", file);
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
        Create Food
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
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
                    placeholder="Enter your name"
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
                    label="Price"
                    size="md"
                    type="number"
                    placeholder="Enter price of food"
                  />
                )}
              />

              <Controller
                name="quantity"
                control={control}
                rules={FORM_VALIDATION.quantity}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Quantity"
                    size="md"
                    type="number"
                    placeholder="Enter quantity of food"
                  />
                )}
              />
            </Flex>

            <Controller
              name="image"
              control={control}
              render={() => <ImageDropzone onUpload={handleImageUpload} />}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/foods">
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

export default CreateFoodForm;
