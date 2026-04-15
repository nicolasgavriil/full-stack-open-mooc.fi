import { useContext } from "react";
import NotificationContext from "../src/NotificationContext.jsx";

export const useNotify = () => useContext(NotificationContext);
