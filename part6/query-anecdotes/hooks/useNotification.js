import { useContext } from "react";
import NotificationContext from "../src/NotificationContext.jsx";

export const useNotification = () => useContext(NotificationContext);
