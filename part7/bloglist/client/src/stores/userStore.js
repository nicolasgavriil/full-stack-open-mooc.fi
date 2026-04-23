import { create } from "zustand";
import userService from "../services/users.js";

const useUserStore = create((set) => ({
  users: [],
  actions: {
    initializeUsers: async () => {
      const users = await userService.getAll();
      set(() => ({ users }));
    },
  },
}));

export const useUsers = () => {
  const users = useUserStore((state) => state.users);
  return users;
};

export const useUserActions = () => useUserStore((state) => state.actions);
