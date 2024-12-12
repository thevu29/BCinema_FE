import {
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
  Flex,
} from "@mantine/core";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getFoodByIdService,
  updateFoodService,
} from "../../../../services/foodService";
import { showNotification } from "../../../../utils/notification";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import ImageDropzone from "../../../Dropzone/ImageDropzone";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Foods", href: "/admin/foods" },
  { title: "Update food", href: "/admin/foods/update" },
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

const UpdateFoodForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      image: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFoodByIdService(id);

        if (res.success) {
          const food = res.data;

          setFood(food);

          reset({
            name: food.name,
            price: food.price,
            quantity: food.quantity,
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

      if (!data.image) {
        showNotification("Image is required", "Error");
        return;
      }

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const res = await updateFoodService(id, formData);

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
        Update Food
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
              render={() => (
                <ImageDropzone object={food} onUpload={handleImageUpload} />
              )}
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

export default UpdateFoodForm;
