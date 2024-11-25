import { Modal, Button, Text, Group, Flex } from "@mantine/core";
import { Link } from "react-router-dom";

const ScheduleInformationModal = ({ opened, close, schedule }) => {
  if (!schedule) return null;

  return (
    <Modal opened={opened} onClose={close} title="Schedule Information">
      <Flex direction="column" gap={12} mb={24}>
        <Text size="sm">
          Movie: <b>{schedule.movieName}</b>{" "}
        </Text>
        <Text size="sm">
          Room: <b>{schedule.roomName}</b>
        </Text>
        <Text size="sm">
          Date: <b>{schedule.date}</b>
        </Text>
        <Text size="sm">
          Status: <b>{schedule.status}</b>
        </Text>
        <Text size="sm">
          Runtime: <b>{schedule.runtime} minutes</b>
        </Text>
      </Flex>

      <Group justify="flex-end">
        <Button onClick={close} color="gray">
          Cancel
        </Button>

        <Link to={`/admin/schedules/${schedule.id}/seat-schedules`}>
          <Button color="blue">View seats</Button>
        </Link>

        <Link to={`/admin/schedules/${schedule.id}/update`}>
          <Button color="indigo">Update</Button>
        </Link>
      </Group>
    </Modal>
  );
};

export default ScheduleInformationModal;
