import { notifications } from "@mantine/notifications";

export const showNotification = (message, type) => {
  notifications.show({
    title: type,
    message: message,
    color: type === "Success" ? "green" : "red",
    position: "top-right",
  });
};
