import { createContext, useRef, useState } from "react";

const NotificationContext = createContext();

export default NotificationContext;

export const NotificationContextProvider = (props) => {
  const [notification, setNotificationState] = useState("");
  const timeoutRef = useRef(null);

  const setNotification = (message, seconds = 5) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotificationState(message);

    timeoutRef.current = setTimeout(() => {
      setNotificationState(null);
    }, seconds * 1000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification,
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};
