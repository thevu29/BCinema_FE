import { notifications } from "@mantine/notifications";

export const showNotification = (message, type) => {
  let color = "";

  switch (type) {
    case "Success":
      color = "green";
      break;
    case "Error":
      color = "red";
      break;
    case "Warning":
      color = "yellow";
      break;
    default:
      color = "blue";
  }

  notifications.show({
    title: type,
    message: message,
    color,
    position: "top-right",
  });
};
