import { Button, Group, Modal, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllUsersService } from "../../../../services/userService";
import { Controller, useForm } from "react-hook-form";
import { showNotification } from "../../../../utils/notification";
import { checkVoucherByCodeService } from "../../../../services/voucherService";

const CheckUseVoucherModal = ({ opened, close }) => {
  const [users, setUsers] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      code: "",
      selectedUser: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersService();

        if (res.success) {
          const users = res.data.map((user) => ({
            value: user.id,
            label: user.email,
          }));

          setUsers(users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (opened) fetchUsers();
  }, [opened]);

  const onSubmit = async (data) => {
    try {
      const res = await checkVoucherByCodeService(data.selectedUser, data.code);

      if (res.success) {
        showNotification(res.message, "Success");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Check user used voucher">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="selectedUser"
          control={control}
          rules={{ required: "User is required" }}
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              error={error?.message}
              searchable
              label="User"
              placeholder="Select a user"
              maxDropdownHeight={150}
              data={users}
            />
          )}
        />

        <Controller
          name="code"
          control={control}
          rules={{ required: "Code is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              error={error?.message}
              mt="md"
              label="Code"
              placeholder="Enter voucher code"
            />
          )}
        />

        <Group mt="xl" grow justify="flex-end">
          <Button onClick={close} color="gray">
            Cancel
          </Button>
          <Button type="submit">Check</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CheckUseVoucherModal;
