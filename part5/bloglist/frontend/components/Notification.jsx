import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  if (!notification) {
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
