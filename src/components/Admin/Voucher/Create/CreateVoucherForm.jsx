import { useState } from "react";
import { Button, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { addVoucherService } from "../../../../services/voucherService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { formatDateForApi } from "../../../../utils/date";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Vouchers", href: "/admin/vouchers" },
  { title: "Create voucher" },
];

const FORM_VALIDATION = {
  code: {
    required: "Code is required",
  },
  discount: {
    required: "Discount is required",
    pattern: {
      value: /^[0-9]+$/,
      message: "Discount must be a number",
    },
  },
  expireAt: {
    required: "Expire date is required",
  },
};

const CreateVoucherForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      code: "",
      discount: "",
      description: "",
      expireAt: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formattedData = {
        ...data,
        expireAt: formatDateForApi(data.expireAt),
      };

      const response = await addVoucherService(formattedData);

      if (response.success) {
        showNotification(response.message, "Success");
        navigate("/admin/vouchers");
      } else {
        showNotification(response.message, "Error");
      }
    } catch (error) {
      console.error("Error adding voucher:", error);
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
        Create Voucher
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow gap={60}>
            <Controller
              name="code"
              control={control}
              rules={FORM_VALIDATION.code}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Code"
                  size="md"
                  placeholder="Enter code"
                />
              )}
            />

            <Controller
              name="discount"
              control={control}
              rules={FORM_VALIDATION.discount}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Discount(%)"
                  size="md"
                  placeholder="Enter discount"
                />
              )}
            />
          </Group>

          <Group grow gap={60} mt={24}>
            <Controller
              name="description"
              control={control}
              rules={FORM_VALIDATION.description}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Description"
                  size="md"
                  placeholder="Enter description"
                />
              )}
            />
            <Controller
              name="expireAt"
              control={control}
              rules={FORM_VALIDATION.expireAt}
              render={({ field, fieldState: { error } }) => (
                <DateInput
                  {...field}
                  error={error?.message}
                  label="Expire date"
                  size="md"
                  valueFormat="DD/MM/YYYY"
                  placeholder="Enter expire date"
                />
              )}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/vouchers">
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

export default CreateVoucherForm;
