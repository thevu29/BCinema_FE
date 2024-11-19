import { Button, Group, LoadingOverlay, Modal, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getAllSeatTypesService } from "../../../../services/seatTypeService";
import { updateSeatService } from "../../../../services/seatService";
import { showNotification } from "../../../../utils/notification";

const UpdateSeatModal = ({
  opened,
  close,
  selectedSeats,
  setSeletedSeats,
  fetchSeats,
  selectedRoom,
}) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      seatTypeId: "",
    },
    mode: "onChange",
  });

  const [seatTypes, setSeatTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSeatTypes = async () => {
      try {
        const res = await getAllSeatTypesService();

        if (res.success) {
          const formattedSeatTypes = res.data.map((seatType) => ({
            value: seatType.id,
            label: seatType.name,
          }));

          setSeatTypes(formattedSeatTypes);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSeatTypes();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = selectedSeats.map((seat) => updateSeatService(seat.id, data));

      const responses = await Promise.all(res);

      if (responses.every((res) => res.success)) {
        showNotification("Seat(s) updated successfully", "Success");
        close();
        setSeletedSeats([]);
        fetchSeats(selectedRoom.value);
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
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

      <Modal opened={opened} onClose={close} title="Update seat(s)">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="seatTypeId"
            control={control}
            rules={{ required: "Seat type is required" }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                error={error?.message}
                label="Seat type"
                size="sm"
                placeholder="Select seat type"
                data={seatTypes}
                allowDeselect={false}
              />
            )}
          />

          <Group mt="xl" justify="flex-end">
            <Button type="button" color="gray" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Save
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default UpdateSeatModal;
