import { Alert } from "@mui/material";
import { useNotification } from "../stores/notificationStore.js";

const Notification = () => {
  const notification = useNotification();

  if (!notification.message) {
    return;
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.message}
    </Alert>
  );
};

export default Notification;
